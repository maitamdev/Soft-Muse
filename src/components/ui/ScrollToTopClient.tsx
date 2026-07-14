"use client";

import dynamic from "next/dynamic";

// ssr: false is valid here because this is a Client Component
const ScrollToTop = dynamic(() => import("./ScrollToTop"), { ssr: false });

export default function ScrollToTopClient() {
 return <ScrollToTop />;
}
