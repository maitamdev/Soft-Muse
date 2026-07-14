import Link from "next/link";
import { IconCompass as Compass } from "@tabler/icons-react";
import Button from "@/components/ui/Button";

export const metadata = {
 title: "trang không| AURA",
 robots: { index: false, follow: false },
};

export default function NotFound() {
 return (
 <div className="bg-background-primary min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 text-center"> <Compass className="w-12 h-12 stroke-[1.2] text-accent" /> <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em] mt-6">404</span> <h1 className="font-serif text-3xl md:text-4xl font-light text-text-primary mt-2">
 này trang không</h1> <p className="font-sans text-sm text-text-secondary font-light mt-3 max-w-md leading-relaxed">
 Đường dẫn không trang.Bộ sưu tập AURA.</p> <div className="flex flex-col sm:flex-row gap-4 mt-8"> <Link href="/"> <Button variant="primary">Trang chủ</Button> </Link> <Link href="/shop"> <Button variant="secondary">Vào cửa hàng couture</Button> </Link> </div> </div>
 );
}
