import Link from "next/link";
import { IconCompass as Compass } from "@tabler/icons-react";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "الصفحة غير موجودة | AURA",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="bg-background-primary min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <Compass className="w-12 h-12 stroke-[1.2] text-accent" />
      <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em] mt-6">٤٠٤</span>
      <h1 className="font-serif text-3xl md:text-4xl font-light text-text-primary mt-2">
        هذه الصفحة غير موجودة
      </h1>
      <p className="font-sans text-sm text-text-secondary font-light mt-3 max-w-md leading-relaxed">
        يبدو أن الرابط الذي تتبعينه غير صحيح أو أن الصفحة لم تعد متوفرة. يمكنكِ العودة لاستكشاف تشكيلة أورا الكاملة.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link href="/">
          <Button variant="primary">العودة للصفحة الرئيسية</Button>
        </Link>
        <Link href="/shop">
          <Button variant="secondary">زيارة المتجر الكوتور</Button>
        </Link>
      </div>
    </div>
  );
}
