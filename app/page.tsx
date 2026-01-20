"use client";

import { useState } from "react";
import { revalidateTagAction, updateTagAction } from "./invalidate/actions";

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

      {/* Version Cards */}
      <section className="animate-slide-up stagger-3">
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#333] animate-slide-up stagger-4">
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
            : "bg-[#f5a623]/10 border border-[#f5a623]/20"
        }`}>
          <span className={`text-lg font-mono font-bold ${
            cardinality === "1" ? "text-[#00d991]" : "text-[#f5a623]"
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
