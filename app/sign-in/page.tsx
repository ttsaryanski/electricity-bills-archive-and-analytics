"use client";
import { SignIn as StackSignIn } from "@stackframe/stack";

const SignIn = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="max-w-md w-full space-y-8">
                <StackSignIn />
            </div>
        </div>
    );
};

export default SignIn;
