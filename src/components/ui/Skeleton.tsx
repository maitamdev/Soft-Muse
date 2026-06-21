import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-brand-border/40 animate-pulse rounded-none ${className}`}
      style={{
        backgroundImage: "linear-gradient(90deg, rgba(231,225,216,0.3) 25%, rgba(231,225,216,0.6) 50%, rgba(231,225,216,0.3) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite linear",
      }}
    />
  );
}

// 1. Skeleton placeholder for a single Product Card
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col w-full gap-4">
      {/* Product Image placeholder (3:4 ratio) */}
      <Skeleton className="aspect-[3/4] w-full" />
      {/* Title placeholder */}
      <Skeleton className="h-4 w-3/4 mt-1" />
      {/* Price / Color Swatches placeholder */}
      <div className="flex justify-between items-center w-full">
        <Skeleton className="h-4 w-1/4" />
        <div className="flex gap-1.5">
          <Skeleton className="w-3.5 h-3.5 rounded-full" />
          <Skeleton className="w-3.5 h-3.5 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// 2. Skeleton placeholder for the Product Detail page
export function ProductDetailSkeleton() {
  return (
    <div className="w-full max-w-[1280px] px-6 md:px-12 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 md:gap-16 items-start">
        {/* Gallery */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3 w-16 md:w-20 shrink-0">
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="aspect-[3/4] w-full" />
          </div>
          <Skeleton className="flex-grow aspect-[3/4]" />
        </div>

        {/* Details Panel */}
        <div className="flex flex-col gap-6 bg-background-secondary border border-brand-border p-6 md:p-8">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-5/6" />
          <Skeleton className="h-6 w-32 mt-2" />
          <div className="flex flex-col gap-2 mt-4">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-2">
              <Skeleton className="w-12 h-8" />
              <Skeleton className="w-12 h-8" />
              <Skeleton className="w-12 h-8" />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <Skeleton className="h-12 flex-grow" />
            <Skeleton className="h-12 w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Skeleton placeholder for items in the Cart Drawer
export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 border-b border-brand-border pb-4 w-full">
      <Skeleton className="w-16 h-20 shrink-0" />
      <div className="flex-grow flex flex-col justify-between py-1">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex justify-between items-center mt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

// 4. Skeleton placeholder for Tracking timeline results
export function TrackingResultSkeleton() {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="bg-background-secondary border border-brand-border p-6 md:p-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-brand-border pb-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex flex-col gap-2 md:text-left">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-4">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
      <div className="bg-background-secondary border border-brand-border p-6 grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 items-center">
        <Skeleton className="aspect-[3/4] w-20 md:w-24 mx-auto md:mx-0" />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5"><Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-24" /></div>
          <div className="flex flex-col gap-1.5"><Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-24" /></div>
          <div className="flex flex-col gap-1.5"><Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-24" /></div>
          <div className="flex flex-col gap-1.5"><Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-24" /></div>
        </div>
      </div>
    </div>
  );
}
