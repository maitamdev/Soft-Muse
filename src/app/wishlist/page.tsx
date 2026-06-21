"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/ui/Card";
import { Heart } from "lucide-react";
import Button from "@/components/ui/Button";

export default function WishlistPage() {
  const { wishlist } = useStore();

  return (
    <div className="bg-background-primary min-h-screen flex flex-col items-center">
      {/* 1. Header banner */}
      <section className="w-full bg-background-secondary py-12 border-b border-brand-border flex flex-col items-center">
        <div className="max-w-[720px] mx-auto px-6 text-center">
          <span className="font-sans text-[10px] text-accent font-bold uppercase">
            خياراتكِ المنسقة
          </span>
          <h1 className="font-sans text-3xl font-light text-text-primary mt-2">
            قائمة المفضلة الراقية
          </h1>
          <p className="font-sans text-xs md:text-sm text-text-secondary font-light mt-3 leading-relaxed">
            احفظي تصميمات أورا المفضلة لديكِ هنا وتابعي توفرها بالبوتيك أو قومي بإضافتها إلى حقيبة التسوق الخاصة بكِ في أي وقت.
          </p>
        </div>
      </section>

      {/* 2. Content */}
      <main className="w-full max-w-[1280px] px-6 md:px-12 py-16">
        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-background-secondary border border-brand-border max-w-xl mx-auto flex flex-col items-center gap-6">
            <Heart className="w-12 h-12 stroke-[1.2] text-accent animate-pulse" />
            <div>
              <h3 className="font-sans text-base font-semibold text-text-primary">مفضلتكِ فارغة</h3>
              <p className="text-xs text-text-secondary font-light mt-1">ابدئي بحفظ القطع المفضلة لديكِ بالضغط على رمز القلب أثناء التصفح</p>
            </div>
            <Link href="/shop">
              <Button variant="primary">زيارة المتجر الكوتور</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlist.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                image={item.image}
                collection={item.collection}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

