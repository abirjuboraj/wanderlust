'use client'
import Link from "next/link"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import { signIn } from "@/utils/auth-client"
import { toast } from "@/components/ui/toast"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"

const SignInPage = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();

        setIsLoading(true);

        const formData = new FormData(e.target);

        const data = Object.fromEntries(formData.entries());

        const { data: userData, error } = await signIn.email({
            email: data.email as string,
            password: data.password as string,

        })

        if (userData) {
            console.log("user data", userData);

            toast.add({
                title: "Signed IN",
                description: "Signed In successfully",
                type: "success",
                timeout: 2000,
            })

            setTimeout(() => {
                setIsLoading(false);
                router.push("/")
            }, 1000)

        }

        if (error) {
            console.log("Error: ", error);

            toast.add({
                title: "Failed to sign in",
                description: `${error.message}`,
                type: "error",
                timeout: 3000,
            })

            setIsLoading(false);
        }

    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-4">
            <div className={cn("w-full max-w-md flex flex-col gap-3")}>
                <Card className="border-border/60 shadow-lg shadow-black/5">
                    <CardHeader className="text-center pb-2 pt-5">
                        <div className="mx-auto mb-1 flex size-9 items-center justify-center rounded-full bg-[#29abe2]/10 text-[#29abe2]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="size-4"
                            >
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                        </div>
                        <CardTitle className="text-xl font-light tracking-tight text-neutral-900">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-xs text-neutral-500">
                            Sign in to your Wanderlust account to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-5 pt-0">
                        <form onSubmit={handleSignIn}>
                            <FieldGroup className="gap-2.5">
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="h-9 w-full gap-2 hover:border-[#29abe2] hover:text-[#29abe2] transition-colors"
                                >
                                    <svg className="size-4" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span>Continue with Google</span>
                                </Button>

                                <FieldSeparator className="my-0.5 *:data-[slot=field-separator-content]:bg-card *:data-[slot=field-separator-content]:text-neutral-400 *:data-[slot=field-separator-content]:text-xs">
                                    or sign in with email
                                </FieldSeparator>

                                <Field className="gap-1">
                                    <FieldLabel htmlFor="email" className="text-xs">Email address</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        className="h-8.5 text-sm focus-visible:border-[#29abe2] focus-visible:ring-[#29abe2]/20"
                                        required
                                    />
                                </Field>

                                <Field className="gap-1">
                                    <div className="flex items-center">
                                        <FieldLabel htmlFor="password" className="text-xs">Password</FieldLabel>
                                        <Link
                                            href="#"
                                            className="ml-auto text-xs text-neutral-500 hover:text-[#29abe2] hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="h-8.5 text-sm focus-visible:border-[#29abe2] focus-visible:ring-[#29abe2]/20"
                                        required
                                    />
                                </Field>

                                <Field className="gap-1.5 pt-1">
                                    <Button
                                        type="submit"
                                        className="h-9 w-full bg-[#29abe2] text-white hover:bg-[#2296c4] font-medium transition-colors"
                                    >
                                       {
                                        isLoading ? (
                                            <>
                                             <Spinner className="size-4" />
                                                <span>Signing In...</span>
                                            </>
                                        ) :
                                        (
                                            "Sign In"
                                        )
                                       }
                                    </Button>
                                    <FieldDescription className="text-center text-xs text-neutral-600">
                                        Don&apos;t have an account?{" "}
                                        <Link
                                            href="/sign-up"
                                            className="font-medium text-[#29abe2] underline-offset-4 hover:underline"
                                        >
                                            Sign up
                                        </Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>

                <p className="px-4 text-center text-[11px] text-neutral-500">
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-[#29abe2]">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-[#29abe2]">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}

export default SignInPage;
