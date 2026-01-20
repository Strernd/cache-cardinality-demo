import { cacheTag } from "next/cache";
import { V2Header } from "@/app/components/V2Header";

interface V2ProductPageProps {
  params: Promise<{ id: string }>;
}

function FormattedTime({ date }: { date: Date }) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return (
    <span className="font-mono">
      <span className="text-zinc-400 dark:text-zinc-500">{hours}:</span>
      <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{minutes}:{seconds}</span>
    </span>
  );
}

export async function generateStaticParams() {
  return Array.from({ length: 999 }, (_, i) => ({
    id: String(i + 1),
  }));
}

async function V2ProductContent({ id }: { id: string }) {
  "use cache";
  cacheTag(`v2-product-${id}`);

  const cachedAt = new Date();

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Product {id}
      </h1>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 flex items-center gap-2">
        page cached at <FormattedTime date={cachedAt} />
      </p>
      <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        <p>Cache tag: <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">v2-product-{id}</code></p>
      </div>
    </div>
  );
}

export default async function V2ProductPage({ params }: V2ProductPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg overflow-hidden">
        <V2Header />
        <V2ProductContent id={id} />
      </div>
    </div>
  );
}
