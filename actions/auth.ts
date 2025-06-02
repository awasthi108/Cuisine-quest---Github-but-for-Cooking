"use server"

import { redirect } from "next/navigation"
import { signIn as nextAuthSignIn } from "next-auth"

export async function signIn(formData: { email: string; password: string }) {
  try {
    const result = await nextAuthSignIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    })

    if (result?.error) {
      return { error: "Invalid credentials" }
    }

    redirect("/")
  } catch (error) {
    return { error: "Something went wrong" }
  }
}
