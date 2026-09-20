"use client";

import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { RotateCw } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 text-center">
        <p className="text-[15px] font-semibold">This view hit an error</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/55">
          EduPath couldn&apos;t render this page. Your journey is safe — retry or head back to the
          dashboard.
        </p>
        {error.digest ? (
          <p className="mt-3 rounded-xl bg-muted px-3 py-2 font-mono text-[11px] text-foreground/45">
            digest: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex gap-3">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Go to dashboard
          </Button>
          <Button className="flex-1" icon={<RotateCw className="h-4 w-4" />} onClick={() => reset()}>
            Try again
          </Button>
        </div>
      </Card>
    </div>
  );
}