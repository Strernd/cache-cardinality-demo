import { cacheTag, cacheLife } from "next/cache";

async function getV2HeaderData() {
  "use cache: remote";
  cacheLife("days");
  cacheTag("v2-header");
  return { cachedAt: new Date() };
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

export async function V2Header() {
  const { cachedAt } = await getV2HeaderData();

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 bg-zinc-50 dark:bg-zinc-900">
      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        v2: Header in page
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 flex items-center gap-2">
        header cached at <FormattedTime date={cachedAt} />
      </p>
    </div>
  );
}
