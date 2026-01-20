import { Suspense } from "react";
import { V0Header } from "@/app/components/V0Header";

export default function V0Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg overflow-hidden">
        <Suspense fallback={<div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900">Loading header...</div>}>
          <V0Header />
        </Suspense>
        <Suspense fallback={<div className="px-6 py-8">Loading...</div>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
