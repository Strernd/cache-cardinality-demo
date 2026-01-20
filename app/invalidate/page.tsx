"use client";

import { useState } from "react";
import { invalidateTag } from "./actions";

export default function InvalidatePage() {
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tag.trim()) return;

    setStatus("Invalidating...");
    const result = await invalidateTag(tag.trim());
    setStatus(result.message);
    setTag("");
  }

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cache Invalidation</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter cache tag (e.g., product-125 or header)"
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Invalidate
          </button>
        </div>
      </form>

      {status && (
        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-8">
          {status}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions - v1 (Products)</h2>
        <div className="flex flex-wrap gap-2">
          <QuickButton tag="header" setTag={setTag} />
          <QuickButton tag="product-1" setTag={setTag} />
          <QuickButton tag="product-50" setTag={setTag} />
          <QuickButton tag="product-100" setTag={setTag} />
          <QuickButton tag="product-500" setTag={setTag} />
          <QuickButton tag="product-999" setTag={setTag} />
        </div>
        <h2 className="text-lg font-semibold mt-4">Quick Actions - v2 (Items)</h2>
        <div className="flex flex-wrap gap-2">
          <QuickButton tag="banner" setTag={setTag} />
          <QuickButton tag="item-1" setTag={setTag} />
          <QuickButton tag="item-50" setTag={setTag} />
          <QuickButton tag="item-100" setTag={setTag} />
          <QuickButton tag="item-500" setTag={setTag} />
          <QuickButton tag="item-999" setTag={setTag} />
        </div>
        <h2 className="text-lg font-semibold mt-4">Quick Actions - v3 (Things)</h2>
        <div className="flex flex-wrap gap-2">
          <QuickButton tag="navbar" setTag={setTag} />
          <QuickButton tag="thing-1" setTag={setTag} />
          <QuickButton tag="thing-50" setTag={setTag} />
          <QuickButton tag="thing-100" setTag={setTag} />
          <QuickButton tag="thing-500" setTag={setTag} />
          <QuickButton tag="thing-999" setTag={setTag} />
        </div>
      </div>

      <div className="mt-8 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Available Tags
        </h2>
        <p className="font-medium text-zinc-700 dark:text-zinc-300 mt-3">v1: /products (Header in layout)</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
              header
            </code>{" "}
            - Invalidates the header component
          </li>
          <li>
            <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
              product-[1-999]
            </code>{" "}
            - Invalidates a specific product page
          </li>
        </ul>
        <p className="font-medium text-zinc-700 dark:text-zinc-300 mt-3">v2: /items (Banner in page)</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
              banner
            </code>{" "}
            - Invalidates the banner component
          </li>
          <li>
            <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
              item-[1-999]
            </code>{" "}
            - Invalidates a specific item page
          </li>
        </ul>
        <p className="font-medium text-zinc-700 dark:text-zinc-300 mt-3">v3: /things (NavBar with id in page)</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
              navbar
            </code>{" "}
            - Invalidates the navbar component (displays id)
          </li>
          <li>
            <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
              thing-[1-999]
            </code>{" "}
            - Invalidates a specific thing page
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Test Links - Products (v1)</h2>
        <div className="flex flex-wrap gap-2">
          {[1, 50, 100, 500, 999].map((id) => (
            <a
              key={id}
              href={`/products/${id}`}
              className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Product {id}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Test Links - Items (v2)</h2>
        <div className="flex flex-wrap gap-2">
          {[1, 50, 100, 500, 999].map((id) => (
            <a
              key={id}
              href={`/items/${id}`}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              Item {id}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Test Links - Things (v3)</h2>
        <div className="flex flex-wrap gap-2">
          {[1, 50, 100, 500, 999].map((id) => (
            <a
              key={id}
              href={`/things/${id}`}
              className="px-3 py-1 bg-green-100 dark:bg-green-900 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            >
              Thing {id}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickButton({
  tag,
  setTag,
}: {
  tag: string;
  setTag: (tag: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => setTag(tag)}
      className="px-3 py-1 bg-zinc-200 dark:bg-zinc-700 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors text-sm"
    >
      {tag}
    </button>
  );
}
