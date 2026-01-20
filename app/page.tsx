export default function Home() {
  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Cache Invalidation Demo</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        Next.js 16 cache tags demonstration with 999 pages each
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">Invalidation UI</h2>
          <a
            href="/invalidate"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Invalidation Panel
          </a>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-1">v0: Header in root layout</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            Tags: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v0-header</code>, <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v0-product-[id]</code>
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 25, 50, 100, 250, 500, 750, 999].map((id) => (
              <a
                key={id}
                href={`/v0/${id}`}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Product {id}
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-1">v1: Header in product layout</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            Tags: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v1-header</code>, <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v1-product-[id]</code>
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 25, 50, 100, 250, 500, 750, 999].map((id) => (
              <a
                key={id}
                href={`/v1/${id}`}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                Product {id}
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-1">v2: Header in page</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            Tags: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v2-header</code>, <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v2-product-[id]</code>
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 25, 50, 100, 250, 500, 750, 999].map((id) => (
              <a
                key={id}
                href={`/v2/${id}`}
                className="px-4 py-2 bg-green-100 dark:bg-green-900 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                Product {id}
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-1">v3: Header (with id prop) in page</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            Tags: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v3-header</code>, <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">v3-product-[id]</code>
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 25, 50, 100, 250, 500, 750, 999].map((id) => (
              <a
                key={id}
                href={`/v3/${id}`}
                className="px-4 py-2 bg-purple-100 dark:bg-purple-900 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
              >
                Product {id}
              </a>
            ))}
          </div>
        </section>

        <section className="text-sm text-zinc-600 dark:text-zinc-400 space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Key Differences
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">v0: Header in root layout</h3>
              <p>Header is in /v0/layout.tsx (above [id]). Shared <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded text-xs">v0-header</code> tag.</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">v1: Header in product layout</h3>
              <p>Header is in /v1/[id]/layout.tsx. Shared <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded text-xs">v1-header</code> tag.</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">v2: Header in page</h3>
              <p>Header rendered directly in page.tsx. Shared <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded text-xs">v2-header</code> tag.</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">v3: Header with id prop</h3>
              <p>Header receives id and displays it. Shared <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded text-xs">v3-header</code> tag.</p>
            </div>
          </div>
        </section>

        <section className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            How to test
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Visit a product page and note both timestamps</li>
            <li>Go to the invalidation panel and invalidate a tag</li>
            <li>Hard refresh the page to see the updated timestamp</li>
            <li>Compare behavior across all versions</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
