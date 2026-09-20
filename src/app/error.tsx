"use client";

import { Button, Card, Logo } from "@/components/ui";
import { RotateCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-full antialiased">
        <div className="flex min-h-screen items-center justify-center p-6">
          <Card className="w-full max-w-md p-8 text-center">
            <div className="flex justify-center">
              <Logo />
            </div>
            <p className="mt-6 text-[15px] font-semibold">Something went wrong</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/55">
              EduPath hit an unexpected error. Your saved journey is safe in local storage — reload
              or rebuild and continue where you left off.
            </p>
            {error.digest ? (
              <p className="mt-3 rounded-xl bg-muted px-3 py-2 font-mono text-[11px] text-foreground/45">
                digest: {error.digest}
              </p>
            ) : null}
            <Button
              className="mt-6 w-full"
              icon={<RotateCw className="h-4 w-4" />}
              onClick={() => reset()}
            >
              Try again
            </Button>
          </Card>
        </div>
      </body>
    </html>
  );
}