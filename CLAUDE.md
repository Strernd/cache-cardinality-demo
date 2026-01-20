# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev` (starts on http://localhost:3000)
- **Build**: `npm run build`
- **Production server**: `npm run start`
- **Lint**: `npm run lint`

## Architecture

Next.js 16 cache invalidation demo using App Router, TypeScript, and Tailwind CSS v4.

### Cache Demo Structure

- `app/products/[id]/page.tsx` - Product pages with `"use cache"` directive and `cacheTag(`product-${id}`)`
- `app/products/[id]/layout.tsx` - Product layout that includes the Header component
- `app/components/Header.tsx` - Cached header component with `cacheTag("header")`
- `app/invalidate/page.tsx` - UI for testing cache invalidation via `revalidateTag()`

### Key APIs

- `cacheTag(tag)` - Associates a cache entry with a tag for invalidation
- `revalidateTag(tag, profile)` - Invalidates cache entries with the given tag (requires cache life profile as second arg)
- `"use cache"` directive - Enables component-level caching (requires `experimental.useCache: true` in next.config.ts)

### Testing the Demo

1. Build and start: `npm run build && npm run start`
2. Visit `/products/1` - note the cached timestamps
3. Visit `/invalidate` - invalidate `product-1` or `header` tags
4. Refresh the product page to see updated timestamps
