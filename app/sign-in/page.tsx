"use client";

import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="max-w-md w-full space-y-8">
                <SignIn forceRedirectUrl="/dashboard" signUpUrl="/sign-up" />
            </div>
        </div>
    );
};

export default SignInPage;
