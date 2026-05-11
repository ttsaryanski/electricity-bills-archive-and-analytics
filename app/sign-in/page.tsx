"use client";
import { SignIn as StackSignIn } from "@stackframe/stack";
import Link from "next/link";

const SignIn = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="max-w-md w-full space-y-8">
                <StackSignIn />
                <Link href="/"> Go Back Home</Link>
            </div>
        </div>
    );
};

export default SignIn;
