"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useTransition } from "react"
import { signIn } from "@/actions/auth"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export default function SignInPage() {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      await signIn(values)
    })
  }

  return (
    <div className="grid h-screen place-items-center">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your email and password to sign in</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {searchParams.get("message") && (
                <Alert className="border-green-200 bg-green-50 text-green-800 mb-4">
                  <AlertDescription>{searchParams.get("message")}</AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="mail@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>
          <div className="text-center">
            <Link href="/auth/forgot-password" className="text-sm text-orange-600 hover:underline">
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
