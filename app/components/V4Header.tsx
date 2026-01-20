import { cacheTag, cacheLife } from "next/cache";

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

// Header data depends on productId - creates N cache entries
// But uses single shared tag - revalidating affects all N entries
async function getHeaderData(productId: string) {
  "use cache: remote";
  cacheLife("days");
  cacheTag("v4-header"); // Single tag for all entries!

  return {
    cachedAt: new Date(),
    productId,
  };
}

export async function V4Header({ productId }: { productId: string }) {
  const { cachedAt } = await getHeaderData(productId);

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 bg-zinc-50 dark:bg-zinc-900">
      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        v4: Header with productId prop (single tag)
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 flex items-center gap-2">
        header cached at <FormattedTime date={cachedAt} />
      </p>
      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
        productId in cache key: {productId}
      </p>
    </div>
  );
}
