"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuthModal } from "@account-kit/react";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
  const { openAuthModal } = useAuthModal();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  return (
    <Card className={cn("relative w-full max-w-md shadow-md bg-white")}>
      <CardHeader className={cn("text-center space-y-4 pb-8")}>
        <CardTitle className={cn("text-3xl font-bold tracking-tight")}>
          Remitra
        </CardTitle>
        <CardDescription
          className={cn("text-base")}
        >
          Experience seamless onchain UX with smart wallets. Click log in to
          continue.
        </CardDescription>
      </CardHeader>

      <CardContent className={cn("space-y-6 pb-8")}>
        <Button
          size="lg"
          onClick={() => openAuthModal()}
          disabled={isLoggingIn}
          className={cn("w-full h-12 text-base font-medium")}
        >
          {isLoggingIn ? <Spinner /> : "Login"}
        </Button>
      </CardContent>
    </Card>
  );
}
