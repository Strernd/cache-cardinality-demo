export default function Home() {
  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
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
          <h2 className="text-xl font-semibold mb-1">v1: Products</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            Header rendered in layout · Tags: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">header</code>, <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">product-[id]</code>
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 25, 50, 100, 250, 500, 750, 999].map((id) => (
              <a
                key={id}
                href={`/products/${id}`}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Product {id}
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-1">v2: Items</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            Banner rendered in page · Tags: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">banner</code>, <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">item-[id]</code>
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 25, 50, 100, 250, 500, 750, 999].map((id) => (
              <a
                key={id}
                href={`/items/${id}`}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                Item {id}
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-1">v3: Things</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            NavBar (displays id) in page · Tags: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">navbar</code>, <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">thing-[id]</code>
          </p>
          <div className="flex flex-wrap gap-2">
            {[1, 25, 50, 100, 250, 500, 750, 999].map((id) => (
              <a
                key={id}
                href={`/things/${id}`}
                className="px-4 py-2 bg-green-100 dark:bg-green-900 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                Thing {id}
              </a>
            ))}
          </div>
        </section>

        <section className="text-sm text-zinc-600 dark:text-zinc-400 space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Key Differences
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">v1: Header in Layout</h3>
              <p>Header is in the layout. One shared <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded text-xs">header</code> tag for all products.</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">v2: Banner in Page</h3>
              <p>Banner is in the page. One shared <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded text-xs">banner</code> tag for all items.</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">v3: NavBar with ID</h3>
              <p>NavBar takes id prop and displays it. One shared <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded text-xs">navbar</code> tag.</p>
            </div>
          </div>
        </section>

        <section className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            How to test
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Visit a product/item page and note both timestamps</li>
            <li>Go to the invalidation panel and invalidate a tag</li>
            <li>Hard refresh the page to see the updated timestamp</li>
            <li>Compare behavior between v1 and v2 when invalidating header/banner</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
