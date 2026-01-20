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
            placeholder="Enter cache tag (e.g., v0-header, v1-product-125)"
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
        <h2 className="text-lg font-semibold">Quick Actions - v0</h2>
        <div className="flex flex-wrap gap-2">
          <QuickButton tag="v0-header" setTag={setTag} />
          <QuickButton tag="v0-product-1" setTag={setTag} />
          <QuickButton tag="v0-product-50" setTag={setTag} />
          <QuickButton tag="v0-product-100" setTag={setTag} />
        </div>

        <h2 className="text-lg font-semibold">Quick Actions - v1</h2>
        <div className="flex flex-wrap gap-2">
          <QuickButton tag="v1-header" setTag={setTag} />
          <QuickButton tag="v1-product-1" setTag={setTag} />
          <QuickButton tag="v1-product-50" setTag={setTag} />
          <QuickButton tag="v1-product-100" setTag={setTag} />
        </div>

        <h2 className="text-lg font-semibold">Quick Actions - v2</h2>
        <div className="flex flex-wrap gap-2">
          <QuickButton tag="v2-header" setTag={setTag} />
          <QuickButton tag="v2-product-1" setTag={setTag} />
          <QuickButton tag="v2-product-50" setTag={setTag} />
          <QuickButton tag="v2-product-100" setTag={setTag} />
        </div>

        <h2 className="text-lg font-semibold">Quick Actions - v3</h2>
        <div className="flex flex-wrap gap-2">
          <QuickButton tag="v3-header" setTag={setTag} />
          <QuickButton tag="v3-product-1" setTag={setTag} />
          <QuickButton tag="v3-product-50" setTag={setTag} />
          <QuickButton tag="v3-product-100" setTag={setTag} />
        </div>
      </div>

      <div className="mt-8 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Available Tags
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-medium text-zinc-700 dark:text-zinc-300">v0: Header in root layout</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li><code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v0-header</code></li>
              <li><code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v0-product-[1-999]</code></li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-zinc-700 dark:text-zinc-300">v1: Header in product layout</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li><code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v1-header</code></li>
              <li><code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v1-product-[1-999]</code></li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-zinc-700 dark:text-zinc-300">v2: Header in page</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li><code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v2-header</code></li>
              <li><code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v2-product-[1-999]</code></li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-zinc-700 dark:text-zinc-300">v3: Header with id in page</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li><code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v3-header</code></li>
              <li><code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v3-product-[1-999]</code></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Test Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium mb-2">v0</p>
            <div className="flex flex-wrap gap-2">
              {[1, 50, 100].map((id) => (
                <a key={id} href={`/v0/${id}`} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm">
                  Product {id}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">v1</p>
            <div className="flex flex-wrap gap-2">
              {[1, 50, 100].map((id) => (
                <a key={id} href={`/v1/${id}`} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm">
                  Product {id}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">v2</p>
            <div className="flex flex-wrap gap-2">
              {[1, 50, 100].map((id) => (
                <a key={id} href={`/v2/${id}`} className="px-3 py-1 bg-green-100 dark:bg-green-900 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm">
                  Product {id}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">v3</p>
            <div className="flex flex-wrap gap-2">
              {[1, 50, 100].map((id) => (
                <a key={id} href={`/v3/${id}`} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors text-sm">
                  Product {id}
                </a>
              ))}
            </div>
          </div>
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
