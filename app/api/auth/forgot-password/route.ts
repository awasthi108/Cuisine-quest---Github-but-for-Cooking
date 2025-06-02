import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import crypto from "crypto"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("cuisine-quest")
    const users = db.collection("users")

    // Check if user exists
    const user = await users.findOne({ email })
    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({ message: "If the email exists, a reset link has been sent" })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await users.updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        },
      },
    )

    // Create email transporter
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: "animemail447@gmail.com",
        pass: "enqb zriv llgu plpx", // Your app password
      },
    })

    // Reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`

    // Email content
    const mailOptions = {
      from: "animemail447@gmail.com",
      to: email,
      subject: "🍳 Cuisine Quest - Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff5f5;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ea580c; margin: 0; font-size: 28px;">🍳 Cuisine Quest</h1>
            <p style="color: #666; margin: 5px 0;">Collaborative Recipe Platform</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Hello <strong>${user.username}</strong>,
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset your password for your Cuisine Quest account. 
              Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #ea580c, #dc2626); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3);">
                Reset My Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="background: #f3f4f6; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">
              ${resetUrl}
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #999; font-size: 14px; margin-bottom: 10px;">
                ⚠️ This link will expire in 1 hour for security reasons.
              </p>
              <p style="color: #999; font-size: 14px; margin-bottom: 10px;">
                If you didn't request this password reset, please ignore this email.
              </p>
              <p style="color: #999; font-size: 14px;">
                Happy cooking! 👨‍🍳👩‍🍳
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #999; font-size: 12px;">
              © 2024 Cuisine Quest. All rights reserved.
            </p>
          </div>
        </div>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: "Password reset email sent successfully" })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
