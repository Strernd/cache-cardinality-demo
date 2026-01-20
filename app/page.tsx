"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { revalidateTagAction, updateTagAction } from "./invalidate/actions";

// Code snippets for each variant highlighting the key difference
const codeSnippets: Record<string, { file: string; code: string; highlight: number[] }> = {
  v0: {
    file: "v0/layout.tsx → components/V0Header.tsx → v0/[id]/page.tsx",
    code: `// ═══ v0/layout.tsx ═══
export default function V0Layout({ children }) {
  return (
    <V0Header />   // ✅ Header included here
    {children}     // ← page.tsx renders here
  );
}

// ═══ components/V0Header.tsx ═══
async function getHeaderData() {      // ✅ Data function
  "use cache: remote";
  cacheTag("v0-header");              // 1 cache entry
  return { cachedAt: new Date() };
}
export async function V0Header() {
  const { cachedAt } = await getHeaderData();
  return <header>...</header>;
}

// ═══ v0/[id]/page.tsx ═══
async function getProductData(id: string) {
  "use cache: remote";
  cacheTag(\`v0-product-\${id}\`);      // 10 cache entries
  return { cachedAt: new Date() };
}
export default async function Page({ params }) {
  const { id } = await params;
  return <V0ProductContent id={id} />;
}`,
    highlight: [4, 10, 11, 12, 22, 23],
  },
  v1: {
    file: "v1/[id]/layout.tsx → components/V1Header.tsx → v1/[id]/page.tsx",
    code: `// ═══ v1/[id]/layout.tsx ═══  (inside [id] folder!)
export default function V1ProductLayout({ children }) {
  return (
    <V1Header />   // ✅ Header here, but NO id prop!
    {children}
  );
}

// ═══ components/V1Header.tsx ═══
async function getHeaderData() {      // No params = 1 entry
  "use cache: remote";
  cacheTag("v1-header");              // Still just 1 entry!
  return { cachedAt: new Date() };
}
export async function V1Header() {    // No props
  const { cachedAt } = await getHeaderData();
  return <header>...</header>;
}

// ═══ v1/[id]/page.tsx ═══
async function getProductData(id: string) {
  "use cache: remote";
  cacheTag(\`v1-product-\${id}\`);
  return { cachedAt: new Date() };
}
export default async function Page({ params }) {
  const { id } = await params;
  return <V1ProductContent id={id} />;
}`,
    highlight: [1, 4, 10, 12, 15],
  },
  v2: {
    file: "v2/[id]/page.tsx → components/V2Header.tsx",
    code: `// ═══ v2/[id]/page.tsx ═══  (NO layout file!)
export default async function V2ProductPage({ params }) {
  const { id } = await params;
  return (
    <div>
      <V2Header />              // ✅ Header in page directly
      <V2ProductContent id={id} />
    </div>
  );
}

// ═══ components/V2Header.tsx ═══
async function getHeaderData() {
  "use cache: remote";
  cacheTag("v2-header");        // 1 entry (no props)
  return { cachedAt: new Date() };
}

// ═══ v2/[id]/page.tsx (continued) ═══
async function getProductData(id: string) {
  "use cache: remote";
  cacheTag(\`v2-product-\${id}\`);  // 10 entries
  return { cachedAt: new Date() };
}`,
    highlight: [1, 6, 14, 15],
  },
  v3: {
    file: "v3/layout.tsx → components/V3Header.tsx → v3/[id]/page.tsx",
    code: `// ═══ v3/layout.tsx ═══
export default function V3Layout({ children }) {
  return (
    <V3Header />
    {children}
  );
}

// ═══ components/V3Header.tsx ═══
async function getHeaderData() {
  "use cache";                  // ⚠️ LOCAL, not remote!
  cacheTag("v3-header");
  return { cachedAt: new Date() };
}

// ═══ v3/[id]/page.tsx ═══
async function getProductData(id: string) {
  "use cache";                  // ⚠️ LOCAL, not remote!
  cacheTag(\`v3-product-\${id}\`);
  return { cachedAt: new Date() };
}

// ⚠️ Each serverless instance has its OWN cache
// Cache is NOT shared across instances!`,
    highlight: [11, 18, 23, 24],
  },
  v4: {
    file: "v4/[id]/page.tsx → components/V4Header.tsx",
    code: `// ═══ v4/[id]/page.tsx ═══  (NO layout file!)
export default async function V4ProductPage({ params }) {
  const { id } = await params;
  return (
    <div>
      <V4Header productId={id} />  // ⚠️ PASSING id AS PROP!
      <V4ProductContent id={id} />
    </div>
  );
}

// ═══ components/V4Header.tsx ═══
async function getHeaderData(productId: string) {  // ⚠️ HAS PARAM
  "use cache: remote";
  cacheTag("v4-header");           // 1 tag, BUT...
  return { cachedAt: new Date(), productId };
}
export async function V4Header({ productId }) {
  const data = await getHeaderData(productId);  // ⚠️ id in key!
  return <header>...</header>;
}

// productId becomes part of cache key!
// 10 products = 10 header cache entries
// revalidateTag("v4-header") invalidates ALL 10`,
    highlight: [6, 13, 15, 19, 23, 24, 25],
  },
  v5: {
    file: "v5/layout.tsx → components/V5Header.tsx → v5/[id]/page.tsx",
    code: `// ═══ v5/layout.tsx ═══
export default function V5Layout({ children }) {
  return (
    <V5Header />
    {children}
  );
}

// ═══ components/V5Header.tsx ═══
// ⚠️ "use cache" on COMPONENT, not data function!
export async function V5Header() {
  "use cache: remote";           // ⚠️ On component!
  cacheTag("v5-header");
  const cachedAt = new Date();
  return <header>...</header>;   // Entire JSX is cached!
}

// ═══ v5/[id]/page.tsx ═══
async function getProductData(id: string) {
  "use cache: remote";           // ✅ Correct: data function
  cacheTag(\`v5-product-\${id}\`);
  return { cachedAt: new Date() };
}

// ⚠️ Header JSX embedded in static shell
// Revalidating header may cascade to page re-renders!`,
    highlight: [10, 11, 12, 15, 25, 26],
  },
};

function CodePopover({ version, color }: { version: string; color: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const snippet = codeSnippets[version];

  // Ensure we only use portal after mount (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const colorAccents: Record<string, string> = {
    emerald: "#00d991",
    blue: "#0070f3",
    teal: "#14b8a6",
    orange: "#f5a623",
    purple: "#a855f7",
    red: "#ef4444",
  };

  const accentColor = colorAccents[color] || "#888";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded border border-[#333] bg-[#1a1a1a] hover:bg-[#222] hover:border-[#444] transition-all duration-200 group"
        title="View code"
      >
        <svg
          className="w-4 h-4 text-[#666] group-hover:text-[#888] transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      </button>

      {isOpen && mounted && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Popover */}
          <div
            ref={popoverRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-3xl animate-scale-in pointer-events-auto">
            <div
              className="rounded-xl border overflow-hidden shadow-2xl"
              style={{
                borderColor: accentColor + "40",
                background: "linear-gradient(145deg, #0a0a0a 0%, #111 100%)"
              }}
            >
              {/* Header */}
              <div
                className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: "#222" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-bold font-mono"
                    style={{ color: accentColor }}
                  >
                    {version}
                  </span>
                  <span className="text-xs text-[#666] font-mono">
                    {snippet.file}
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-[#222] transition-colors"
                >
                  <svg className="w-4 h-4 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Code */}
              <div className="p-4 overflow-x-auto">
                <pre className="text-[13px] leading-relaxed font-mono">
                  {snippet.code.split("\n").map((line, i) => (
                    <div
                      key={i}
                      className={`px-2 -mx-2 ${
                        snippet.highlight.includes(i + 1)
                          ? "bg-white/5 border-l-2"
                          : "border-l-2 border-transparent"
                      }`}
                      style={{
                        borderLeftColor: snippet.highlight.includes(i + 1) ? accentColor : "transparent",
                      }}
                    >
                      <span className="inline-block w-6 text-[#444] text-right mr-4 select-none text-xs">
                        {i + 1}
                      </span>
                      <span className="text-[#a0a0a0]">
                        <CodeLine line={line} accentColor={accentColor} />
                      </span>
                    </div>
                  ))}
                </pre>
              </div>

              {/* Footer hint */}
              <div className="px-4 py-2 border-t border-[#222] bg-[#0a0a0a]">
                <p className="text-[10px] text-[#555] font-mono">
                  Highlighted lines show the key difference for this variant
                </p>
              </div>
            </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

// Simple syntax highlighting
function CodeLine({ line, accentColor }: { line: string; accentColor: string }) {
  // Comments
  if (line.trim().startsWith("//")) {
    return <span className="text-[#555] italic">{line}</span>;
  }

  // Apply basic highlighting
  let result = line;

  // Strings (including "use cache")
  result = result.replace(
    /("use cache: remote"|"use cache"|"[^"]*")/g,
    '<span style="color: #7dd3a0">$1</span>'
  );

  // Keywords
  result = result.replace(
    /\b(async|function|export|const|return|await)\b/g,
    '<span style="color: #c792ea">$1</span>'
  );

  // Function calls like cacheTag, cacheLife
  result = result.replace(
    /\b(cacheTag|cacheLife|getHeaderData)\b/g,
    `<span style="color: ${accentColor}">$1</span>`
  );

  // JSX
  result = result.replace(
    /(&lt;[^&]*&gt;|<[^>]+>)/g,
    '<span style="color: #82aaff">$1</span>'
  );

  return <span dangerouslySetInnerHTML={{ __html: result }} />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <header className="border-b border-[#333] animate-fade-in">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-[#888] text-sm font-mono mb-4">Next.js 16</p>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Cache Cardinality
          </h1>
          <p className="text-xl text-[#888] max-w-2xl">
            Understanding how cache tag invalidation scales across different component architectures.
          </p>
        </div>
      </header>

      {/* Goal Section */}
      <section className="border-b border-[#333] animate-slide-up stagger-1">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-start gap-4">
            <div className="w-1 h-full bg-[#0070f3] rounded-full self-stretch" />
            <div>
              <h2 className="text-lg font-semibold mb-2">The Goal</h2>
              <p className="text-[#888] leading-relaxed">
                When we call <code className="px-2 py-0.5 bg-[#1a1a1a] rounded text-sm font-mono text-white">revalidateTag(&quot;header&quot;)</code>,
                only the header should be re-rendered. Product cache entries should remain untouched.
                The <span className="text-white font-medium">cardinality</span> of this operation should be <span className="text-[#00d991] font-mono">O(1)</span>—one
                header cache entry—not <span className="text-[#f5a623] font-mono">O(N)</span> where N is the number of pages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cache Explainer */}
      <section className="border-b border-[#333] animate-slide-up stagger-2">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-[#333] bg-[#0a0a0a]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#00d991]" />
                <code className="text-sm font-mono">&quot;use cache: remote&quot;</code>
              </div>
              <p className="text-sm text-[#888] leading-relaxed">
                Stores cached output in a shared remote cache (Redis, KV). On Vercel, this is automatic.
                All serverless instances share the same cache entries, providing consistent behavior and high hit rates.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-[#333] bg-[#0a0a0a]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#f5a623]" />
                <code className="text-sm font-mono">&quot;use cache&quot;</code>
              </div>
              <p className="text-sm text-[#888] leading-relaxed">
                Stores cached output in-memory per instance. In serverless, each instance has its own ephemeral cache—entries
                are NOT shared, leading to redundant work and unpredictable invalidation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Function vs Component Caching */}
      <section className="border-b border-[#333] animate-slide-up stagger-3">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-1 h-full bg-[#f97316] rounded-full self-stretch" />
            <div>
              <h2 className="text-lg font-semibold mb-2">Cache the Data, Not the Component</h2>
              <p className="text-[#888] leading-relaxed">
                Where you place <code className="px-2 py-0.5 bg-[#1a1a1a] rounded text-sm font-mono text-white">&quot;use cache&quot;</code> matters.
                Caching the <span className="text-white font-medium">data function</span> gives you precise invalidation control.
                Caching the <span className="text-white font-medium">component</span> embeds its output in the static shell, causing cascading re-renders.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Wrong: Cached Component */}
            <div className="p-5 rounded-lg border border-[#333] bg-[#0a0a0a]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                <span className="text-sm font-medium text-[#ef4444]">Avoid: Cached Component</span>
              </div>
              <pre className="text-xs font-mono text-[#888] bg-[#111] p-3 rounded overflow-x-auto mb-3">
{`async function Header() {
  "use cache: remote";
  cacheTag("header");
  const data = new Date();
  return <header>...</header>;
}`}
              </pre>
              <p className="text-xs text-[#888] leading-relaxed">
                The entire JSX output is cached and <span className="text-[#ef4444]">embedded in the static shell</span>.
                Invalidating this tag forces the shell to regenerate, potentially re-rendering sibling components too.
              </p>
            </div>

            {/* Right: Cached Data Function */}
            <div className="p-5 rounded-lg border border-[#333] bg-[#0a0a0a]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#00d991]" />
                <span className="text-sm font-medium text-[#00d991]">Prefer: Cached Data Function</span>
              </div>
              <pre className="text-xs font-mono text-[#888] bg-[#111] p-3 rounded overflow-x-auto mb-3">
{`async function getHeaderData() {
  "use cache: remote";
  cacheTag("header");
  return { cachedAt: new Date() };
}

async function Header() {
  const data = await getHeaderData();
  return <header>...</header>;
}`}
              </pre>
              <p className="text-xs text-[#888] leading-relaxed">
                Only the data is cached. The component renders dynamically using cached data.
                Invalidating this tag <span className="text-[#00d991]">only affects the data</span>—other cache entries stay intact.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg border border-[#333] bg-[#0a0a0a]/50">
            <p className="text-sm text-[#888]">
              <span className="text-white font-medium">Why it matters:</span> When <code className="px-1.5 py-0.5 bg-[#1a1a1a] rounded text-xs font-mono">use cache</code> is
              on a component, its rendered output becomes part of the page&apos;s static shell. Revalidating triggers shell regeneration,
              which can cascade to re-render other components on the page—even if their cache tags weren&apos;t invalidated.
              With data function caching, only the data layer is affected, preserving true O(1) invalidation.
            </p>
          </div>
        </div>
      </section>

      {/* Version Cards */}
      <section className="animate-slide-up stagger-4">
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-6">
          <VersionCard
            version="v0"
            title="Header in root layout"
            cacheType="remote"
            status="works"
            cardinality="1"
            cardinalityLabel="One header cache entry"
            description="Header and product have separate cache entries in a shared remote cache. Invalidating the header tag affects exactly 1 cache entry—the header. All 10 product cache entries remain untouched."
            headerTag="v0-header"
            productTag="v0-product-[id]"
            color="emerald"
          />

          <VersionCard
            version="v1"
            title="Header in product layout"
            cacheType="remote"
            status="works"
            cardinality="1"
            cardinalityLabel="One header cache entry"
            description="Even though the header is in [id]/layout.tsx, it has no props—so there's still only one cache entry shared across all products. Invalidation cardinality remains O(1)."
            headerTag="v1-header"
            productTag="v1-product-[id]"
            color="blue"
          />

          <VersionCard
            version="v2"
            title="Header in page"
            cacheType="remote"
            status="works"
            cardinality="1"
            cardinalityLabel="One header cache entry"
            description="Header rendered directly in page.tsx but still has no props. Cache key is determined by function ID + arguments. No arguments = single shared cache entry = O(1) invalidation."
            headerTag="v2-header"
            productTag="v2-product-[id]"
            color="teal"
          />

          <VersionCard
            version="v3"
            title="Header in root layout"
            cacheType="local"
            status="fails"
            cardinality="N"
            cardinalityLabel="Per-instance cache"
            description="Uses in-memory cache. Each serverless instance maintains its own cache. When you hit a different instance, both header and product may render fresh—appearing as if both were invalidated. Effective cardinality is O(instances × pages)."
            headerTag="v3-header"
            productTag="v3-product-[id]"
            color="orange"
          />

          <VersionCard
            version="v4"
            title="Header depends on productId"
            cacheType="remote"
            status="fails"
            cardinality="N"
            cardinalityLabel="N cache entries, 1 tag"
            description="Header receives productId as a prop, making it part of the cache key. This creates 10 separate header cache entries (one per product). Revalidating the single 'v4-header' tag invalidates all 10 entries—O(N) cardinality despite using one tag."
            headerTag="v4-header"
            productTag="v4-product-[id]"
            color="purple"
          />

          <VersionCard
            version="v5"
            title="Cached component (not data fn)"
            cacheType="remote"
            status="fails"
            cardinality="1*"
            cardinalityLabel="Shell cascade issue"
            description="Header uses 'use cache' on the component itself, not a data function. The rendered JSX is embedded in the static shell. Revalidating may trigger shell regeneration, causing sibling components to re-render even if their tags weren't invalidated."
            headerTag="v5-header"
            productTag="v5-product-[id]"
            color="red"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#333] animate-slide-up stagger-5">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">How to Test</h3>
              <ol className="text-sm text-[#888] space-y-2 list-decimal list-inside">
                <li>Visit a product page and note both timestamps</li>
                <li>Click &quot;revalidate header&quot; on this page</li>
                <li>Hard refresh the product page</li>
                <li>Only the header timestamp should change</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Deploy to See Full Effect</h3>
              <p className="text-sm text-[#888] mb-4">
                Local dev uses a single process. Deploy to Vercel to see the difference between remote and local cache across multiple serverless instances.
              </p>
              <a
                href="/invalidate"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:bg-[#eee] transition-colors"
              >
                Open Invalidation Panel
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function VersionCard({
  version,
  title,
  cacheType,
  status,
  cardinality,
  cardinalityLabel,
  description,
  headerTag,
  productTag,
  color,
}: {
  version: string;
  title: string;
  cacheType: "remote" | "local";
  status: "works" | "fails";
  cardinality: string;
  cardinalityLabel: string;
  description: string;
  headerTag: string;
  productTag: string;
  color: string;
}) {
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const handleRevalidate = async () => {
    const result = await revalidateTagAction(headerTag);
    setActionStatus(result.message);
    setTimeout(() => setActionStatus(null), 2000);
  };

  const handleUpdate = async () => {
    const result = await updateTagAction(headerTag);
    setActionStatus(result.message);
    setTimeout(() => setActionStatus(null), 2000);
  };

  const colorClasses = {
    emerald: "border-l-[#00d991]",
    blue: "border-l-[#0070f3]",
    teal: "border-l-[#14b8a6]",
    orange: "border-l-[#f5a623]",
    purple: "border-l-[#a855f7]",
    red: "border-l-[#ef4444]",
  };

  return (
    <div className={`p-6 rounded-lg border border-[#333] bg-[#0a0a0a] border-l-2 ${colorClasses[color as keyof typeof colorClasses]} hover:bg-[#111] transition-colors`}>
      {/* Header Row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-2xl font-bold font-mono">{version}</span>
        <span className="text-[#888]">{title}</span>

        {/* Badges */}
        <span className={`px-2 py-0.5 text-xs font-mono rounded ${
          cacheType === "remote"
            ? "bg-[#00d991]/10 text-[#00d991]"
            : "bg-[#f5a623]/10 text-[#f5a623]"
        }`}>
          {cacheType}
        </span>

        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
          status === "works"
            ? "bg-[#00d991] text-black"
            : "bg-[#f5a623] text-black"
        }`}>
          {status === "works" ? "WORKS" : "FAILS"}
        </span>

        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <CodePopover version={version} color={color} />
          <button
            onClick={handleRevalidate}
            className="px-3 py-1.5 text-xs font-medium bg-[#1a1a1a] border border-[#333] rounded hover:bg-[#222] hover:border-[#444] transition-colors"
          >
            revalidate header
          </button>
          <button
            onClick={handleUpdate}
            className="px-3 py-1.5 text-xs font-medium bg-[#1a1a1a] border border-[#333] rounded hover:bg-[#222] hover:border-[#444] transition-colors"
          >
            update header
          </button>
          {actionStatus && (
            <span className="text-xs text-[#00d991] animate-pulse">
              {actionStatus}
            </span>
          )}
        </div>
      </div>

      {/* Cardinality Badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${
          cardinality === "1"
            ? "bg-[#00d991]/10 border border-[#00d991]/20"
            : cardinality === "1*"
            ? "bg-[#ef4444]/10 border border-[#ef4444]/20"
            : "bg-[#f5a623]/10 border border-[#f5a623]/20"
        }`}>
          <span className={`text-lg font-mono font-bold ${
            cardinality === "1" ? "text-[#00d991]" : cardinality === "1*" ? "text-[#ef4444]" : "text-[#f5a623]"
          }`}>
            O({cardinality})
          </span>
          <span className="text-xs text-[#888]">{cardinalityLabel}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[#888] leading-relaxed mb-4">
        {description}
      </p>

      {/* Tags */}
      <div className="flex items-center gap-4 text-xs text-[#666] mb-4">
        <span>
          <code className="px-1.5 py-0.5 bg-[#1a1a1a] rounded font-mono">{headerTag}</code>
        </span>
        <span>
          <code className="px-1.5 py-0.5 bg-[#1a1a1a] rounded font-mono">{productTag}</code>
        </span>
      </div>

      {/* Product Links */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => (
          <a
            key={id}
            href={`/${version}/${id}`}
            className="px-3 py-1.5 text-sm font-mono bg-[#1a1a1a] border border-[#333] rounded hover:bg-[#222] hover:border-[#444] transition-colors"
          >
            {id}
          </a>
        ))}
      </div>
    </div>
  );
}
