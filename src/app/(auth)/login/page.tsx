"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui";
import { LoginForm } from "@/components/auth";

function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";
  const registerParam = searchParams.get("register");
  const initialStep = registerParam ? "register" : undefined;

  return <LoginForm redirectUrl={redirectUrl} initialStep={initialStep} />;
}

export default function LoginPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
