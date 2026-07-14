"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IconAlertTriangle as AlertTriangle } from "@tabler/icons-react";
import Button from "@/components/ui/Button";

export default function ErrorPage({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 useEffect(() => {
 console.error(error);
 }, [error]);

 return (
 <div className="bg-background-primary min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 text-center"> <AlertTriangle className="w-12 h-12 stroke-[1.2] text-accent" /> <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em] mt-6">Đã xảy ra lỗi không mong muốn</span> <h1 className="font-serif text-3xl md:text-4xl font-light text-text-primary mt-2">
,Đã xảy ra lỗi </h1> <p className="font-sans text-sm text-text-secondary font-light mt-3 max-w-md leading-relaxed">
 tải này trang.,Trang chủ.
 </p> <div className="flex flex-col sm:flex-row gap-4 mt-8"> <Button variant="primary" onClick={reset}>Thao tác</Button> <Link href="/"> <Button variant="secondary">Trang chủ</Button> </Link> </div> </div>
 );
}
