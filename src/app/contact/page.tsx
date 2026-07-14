import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ContactItems } from "./ContactItems";
import { generatePageMetadata } from "@/utils/seo-helper";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(
    "contact",
    "Liên hệ | Soft Muse",
    "Liên hệ Soft Muse để được tư vấn size, sản phẩm, đơn hàng, đổi trả và các kênh hỗ trợ khách hàng."
  );
}

export default function ContactPage() {
  return (
    <div className="bg-background-primary min-h-screen">
      <section className="w-full bg-background-secondary border-b border-brand-border py-16 md:py-24 text-center">
        <div className="mx-auto max-w-[760px] px-6">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
            Soft Muse Care
          </span>
          <h1 className="mt-3 font-sans text-4xl md:text-6xl font-light text-text-primary">
            Liên hệ với chúng tôi
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-text-secondary">
            Soft Muse luôn sẵn sàng hỗ trợ chọn size, tư vấn sản phẩm, kiểm tra đơn hàng và chính sách đổi trả.
          </p>
        </div>
      </section>

      <main className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-6 py-14 md:grid-cols-[1fr_0.9fr] md:px-12 md:py-24">
        <ContactItems />
        <section className="border border-brand-border bg-background-secondary p-7 md:p-8 text-left" dir="ltr">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
            Tư vấn nhanh
          </span>
          <h2 className="mt-3 font-sans text-2xl font-light text-text-primary">
            Bạn cần hỗ trợ chọn outfit?
          </h2>
          <p className="mt-4 font-sans text-sm font-light leading-[1.9] text-text-secondary">
            Gửi chiều cao, cân nặng, số đo và dịp sử dụng. Soft Muse sẽ gợi ý size, màu sắc và cách phối phù hợp.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="https://zalo.me/0900000000" target="_blank" rel="noopener noreferrer">
              <Button variant="primary">Chat Zalo</Button>
            </a>
            <a href="https://m.me/softmuse.vn" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">Messenger</Button>
            </a>
            <Link href="/shop">
              <Button variant="secondary">Xem sản phẩm</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
