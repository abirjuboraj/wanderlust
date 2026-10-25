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
import { signUp } from "@/utils/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/toast"
import { Spinner } from "@/components/ui/spinner"
import { useState } from "react"

const SignUpPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e: React.SubmitEvent<HTMLFormElement>) => {

        e.preventDefault();

        const formData = new FormData(e.target);

        const data = Object.fromEntries(formData.entries());

        const { data: userData, error } = await signUp.email({
            email: data.email as string,
            password: data.password as string,
            name: data.fullName as string,
        },
        {
            onRequest: () => {
                setIsLoading(true);
            },
            onSuccess: (ctx) => {
                console.log("Sign up successful: ", ctx.data);
                toast.add({
                    title: "Account Created!",
                    description: "Your account was created successfully. Redirecting to sign in...",
                    type: "success",
                    timeout: 3000,
                });
                setTimeout(() => {
                    setIsLoading(false);
                    router.push("/sign-in");
                }, 1500);
            },
            onError: (ctx) => {
                setIsLoading(false);
                toast.add({
                    title: "Error",
                    description: ctx.error.message || "Failed to create account.",
                    type: "error",
                    timeout: 3000,
                });
            }
        }
    )
        if (userData) {
            console.log("User data: ", userData);

        }
        if (error) {
            console.log("Error: ", error);
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
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="19" x2="19" y1="8" y2="14" />
                                <line x1="22" x2="16" y1="11" y2="11" />
                            </svg>
                        </div>
                        <CardTitle className="text-xl font-light tracking-tight text-neutral-900">
                            Create your account
                        </CardTitle>
                        <CardDescription className="text-xs text-neutral-500">
                            Join Wanderlust to discover and book unforgettable adventures
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-5 pt-0">
                        <form onSubmit={handleSignUp}>
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
                                    or sign up with email
                                </FieldSeparator>

                                <Field className="gap-1">
                                    <FieldLabel htmlFor="fullName" className="text-xs">Full Name</FieldLabel>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        name="fullName"
                                        placeholder="John Doe"
                                        className="h-8.5 text-sm focus-visible:border-[#29abe2] focus-visible:ring-[#29abe2]/20"
                                        required
                                    />
                                </Field>

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

                                <div className="grid grid-cols-2 gap-2.5">
                                    <Field className="gap-1">
                                        <FieldLabel htmlFor="password" className="text-xs">Password</FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            className="h-8.5 text-sm focus-visible:border-[#29abe2] focus-visible:ring-[#29abe2]/20"
                                            required
                                        />
                                    </Field>

                                    <Field className="gap-1">
                                        <FieldLabel htmlFor="confirmPassword" className="text-xs">Confirm Password</FieldLabel>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            className="h-8.5 text-sm focus-visible:border-[#29abe2] focus-visible:ring-[#29abe2]/20"
                                            required
                                        />
                                    </Field>
                                </div>

                                <Field className="gap-1.5 pt-1">
                                    <Button
                                        type="submit"
                                        className="h-9 w-full bg-[#29abe2] text-white hover:bg-[#2296c4] font-medium transition-colors"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Spinner className="size-4" />
                                                <span>Creating account...</span>
                                            </>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </Button>
                                    <FieldDescription className="text-center text-xs text-neutral-600">
                                        Already have an account?{" "}
                                        <Link
                                            href="/sign-in"
                                            className="font-medium text-[#29abe2] underline-offset-4 hover:underline"
                                        >
                                            Sign in
                                        </Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>

                <p className="px-4 text-center text-[11px] text-neutral-500">
                    By signing up, you agree to our{" "}
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

export default SignUpPage;
