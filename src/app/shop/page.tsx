"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  IconAdjustmentsHorizontal as SlidersHorizontal,
  IconChevronLeft,
  IconChevronRight,
  IconSearch as Search,
} from "@tabler/icons-react";
import { ProductCard } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { useStorefrontCategories } from "@/hooks/useStorefrontCategories";
import { discountOriginalPrice, primaryImage, resolveStockStatus } from "@/data/mock/products";

const SIZES = ["XS", "S", "M", "L", "XL", "F"];
const COLORS = ["Trắng kem", "Đen", "Hồng đất", "Be", "Nâu mocha", "Xám ghi", "Xanh navy", "Xanh sage"];
const PAGE_SIZE = 12;

function ShopContent() {
  const searchParams = useSearchParams();
  const products = useStorefrontProducts();
  const categories = useStorefrontCategories();
  const categoryParam = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSelectedCategory(categoryParam ?? "");
  }, [categoryParam]);

  const categoryOptions = useMemo(() => {
    return ["", ...categories.map((category) => category.name)];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.collection.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      const matchesSize =
        selectedSizes.length === 0 || Boolean(product.sizes?.some((size) => selectedSizes.includes(size)));
      const matchesColor =
        selectedColors.length === 0 || Boolean(product.colors?.some((color) => selectedColors.includes(color)));

      return matchesSearch && matchesCategory && matchesPrice && matchesSize && matchesColor;
    });
  }, [products, searchQuery, selectedCategory, priceRange, selectedSizes, selectedColors]);

  const sortedProducts = useMemo(() => {
    if (sortBy === "price_asc") return [...filteredProducts].sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") return [...filteredProducts].sort((a, b) => b.price - a.price);
    return filteredProducts;
  }, [filteredProducts, sortBy]);

  const pageCount = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange, selectedSizes, selectedColors, sortBy]);

  useEffect(() => {
    if (currentPage > pageCount) setCurrentPage(pageCount);
  }, [currentPage, pageCount]);

  const paginatedProducts = sortedProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange({ min: 0, max: 1000000 });
    setSearchQuery("");
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  return (
    <div className="bg-background-primary min-h-screen flex flex-col items-center w-full">
      <section className="w-full bg-background-secondary py-12 md:py-16 border-b border-brand-border flex flex-col items-center">
        <div className="max-w-[760px] mx-auto px-6 text-center">
          <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.22em]">
            Soft Muse Boutique
          </span>
          <h1 className="font-sans text-3xl md:text-4xl font-light text-text-primary mt-3">
            {selectedCategory || "Sản phẩm"}
          </h1>
          <p className="font-sans text-xs md:text-sm text-text-secondary font-light mt-4 leading-relaxed">
            Thời trang công sở nữ thanh lịch, tối giản và dễ ứng dụng mỗi ngày.
          </p>
        </div>
      </section>

      <section className="w-full max-w-[1280px] px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-brand-border/60">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categoryOptions.map((category) => (
            <button
              key={category || "all"}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 font-sans text-xs transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary ${
                selectedCategory === category
                  ? "text-accent border-b-2 border-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {category || "Tất cả"}
            </button>
          ))}
        </div>

        <div className="flex items-center flex-wrap gap-3 md:gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 w-full md:w-72">
            <input
              type="text"
              placeholder="Tìm áo sơ mi, blazer, váy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background-secondary text-xs font-sans font-light py-2.5 ps-8 pe-3 border border-brand-border focus:border-accent outline-none"
            />
            <Search className="w-4 h-4 text-text-secondary/50 absolute start-3 top-1/2 -translate-y-1/2" />
          </div>
          <label className="relative shrink-0">
            <span className="sr-only">Sắp xếp sản phẩm</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none bg-background-secondary text-xs font-sans text-text-secondary border border-brand-border py-2.5 ps-3 pe-8 outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá: thấp đến cao</option>
              <option value="price_desc">Giá: cao đến thấp</option>
            </select>
          </label>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-brand-border text-xs font-sans text-text-secondary hover:text-text-primary hover:border-text-primary transition-colors shrink-0 bg-background-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Lọc</span>
          </button>
        </div>
      </section>

      <main className="w-full max-w-[1280px] px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 md:gap-12 items-start">
          {showFilters && (
            <aside className="bg-background-secondary border border-brand-border p-6 flex flex-col gap-6 lg:sticky lg:top-24">
              <FilterGroup title="Kích cỡ" onClear={() => setSelectedSizes([])} showClear={selectedSizes.length > 0}>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <FilterButton
                      key={size}
                      selected={selectedSizes.includes(size)}
                      onClick={() =>
                        setSelectedSizes((current) =>
                          current.includes(size) ? current.filter((item) => item !== size) : [...current, size],
                        )
                      }
                    >
                      {size}
                    </FilterButton>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Màu sắc" onClear={() => setSelectedColors([])} showClear={selectedColors.length > 0}>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <FilterButton
                      key={color}
                      selected={selectedColors.includes(color)}
                      onClick={() =>
                        setSelectedColors((current) =>
                          current.includes(color) ? current.filter((item) => item !== color) : [...current, color],
                        )
                      }
                    >
                      {color}
                    </FilterButton>
                  ))}
                </div>
              </FilterGroup>

              <div>
                <h3 className="font-sans text-xs font-bold text-text-primary border-b border-brand-border pb-2 mb-3">
                  Giá (đ)
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={priceRange.min || ""}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full bg-background-primary border border-brand-border text-xs p-2.5 outline-none focus:border-accent font-display"
                  />
                  <span className="text-xs font-sans text-text-secondary">đến</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={priceRange.max || ""}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full bg-background-primary border border-brand-border text-xs p-2.5 outline-none focus:border-accent font-display"
                  />
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="w-full py-2.5 border border-accent text-[10px] uppercase text-accent hover:bg-accent hover:text-background-secondary transition-colors font-sans font-bold text-center mt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary"
              >
                Xóa bộ lọc
              </button>
            </aside>
          )}

          <div className="flex-grow w-full">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-background-secondary border border-brand-border">
                <p className="font-sans text-lg font-light text-text-primary">Không tìm thấy sản phẩm phù hợp</p>
                <p className="text-xs text-text-secondary font-sans font-light mt-1">
                  Hãy thử đổi danh mục, màu sắc hoặc khoảng giá.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="font-sans text-xs text-text-secondary">
                    {sortedProducts.length.toLocaleString("vi-VN")} sản phẩm
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.name}
                      price={product.price}
                      originalPrice={discountOriginalPrice(product)}
                      image={primaryImage(product)}
                      hoverImage={product.hoverImage}
                      collection={product.collection}
                      variants={product.colorVariants}
                      badge={product.badge}
                      stockStatus={resolveStockStatus(product)}
                      index={index}
                    />
                  ))}
                </div>

                {pageCount > 1 && (
                  <nav
                    aria-label="Phân trang sản phẩm"
                    className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-brand-border/60"
                  >
                    <button
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      aria-label="Trang trước"
                      className="flex items-center justify-center w-9 h-9 border border-brand-border text-text-secondary hover:text-text-primary hover:border-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <IconChevronRight className="w-4 h-4" />
                    </button>

                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`min-w-[36px] h-9 px-2 text-xs font-sans transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                          page === currentPage
                            ? "bg-text-primary text-background-secondary font-semibold"
                            : "border border-brand-border text-text-secondary hover:text-text-primary hover:border-text-primary"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                      disabled={currentPage === pageCount}
                      aria-label="Trang sau"
                      className="flex items-center justify-center w-9 h-9 border border-brand-border text-text-secondary hover:text-text-primary hover:border-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <IconChevronLeft className="w-4 h-4" />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function FilterGroup({
  title,
  showClear,
  onClear,
  children,
}: {
  title: string;
  showClear: boolean;
  onClear: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-brand-border pb-2 mb-4">
        <h3 className="font-sans text-xs font-bold text-text-primary">{title}</h3>
        {showClear && (
          <button
            onClick={onClear}
            className="text-[10px] text-text-secondary hover:text-accent font-sans underline underline-offset-2"
          >
            Xóa
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function FilterButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`min-w-[40px] text-xs px-3 py-1.5 border transition-all duration-300 font-sans ${
        selected
          ? "border-accent bg-accent text-white font-semibold shadow-sm"
          : "border-brand-border text-text-secondary bg-background-primary hover:border-accent/50 hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Skeleton className="w-12 h-12 rounded-full" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
