"use client";

import React from "react";
import { IconInfoCircle, IconExternalLink } from "@tabler/icons-react";
import { FadeIn } from "@/components/admin/ui/motion";

export default function RedirectsManager() {
 return (
 <FadeIn className="max-w-2xl mx-auto py-10 space-y-6"> <div className="bg-[var(--admin-bg-surface)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-xl)] p-8 text-left" dir="ltr"> <div className="flex items-start gap-4"> <IconInfoCircle size={28} className="text-[var(--admin-primary)] shrink-0 mt-0.5" /> <div className="space-y-3"> <h2 className="text-lg font-bold text-[var(--admin-text-base)]">(Redirects)</h2> <p className="text-sm text-[var(--admin-text-muted)] leading-relaxed">
 trongNext.js trên{""}<code className="bg-[var(--admin-bg-elevated)] px-1.5 py-0.5 rounded text-xs font-mono text-[var(--admin-primary)]">next.config.ts</code>{""}
 Áp dụngtừlocalStorage. trênThêm API Đơn hàng Middleware.
 </p> <div className="pt-2 space-y-2 text-sm font-medium text-[var(--admin-text-base)]"> <p className="font-bold">Thêm :</p> <ol className="list-decimal list-inside space-y-1 text-[var(--admin-text-muted)] text-sm"> <li><code className="bg-[var(--admin-bg-elevated)] px-1 py-0.5 rounded text-xs font-mono">next.config.ts</code> trong</li> <li> <code className="bg-[var(--admin-bg-elevated)] px-1 py-0.5 rounded text-xs font-mono">async redirects()</code>:
 <pre className="mt-2 bg-[var(--admin-bg-elevated)] border border-[var(--admin-border-light)] rounded-[var(--admin-radius-md)] p-3 text-xs font-mono text-left overflow-x-auto" dir="ltr">
{`{ source: '/old-path', destination: '/new-path', permanent: true }`}
 </pre> </li> <li>Áp dụng </li> </ol> </div> <p className="text-xs text-[var(--admin-text-subtle)] pt-2">
 đếnSupabase, Áp dụng Middleware từ.</p> <a
 href="https://nextjs.org/docs/app/api-reference/next-config-js/redirects"
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-1.5 text-xs text-[var(--admin-primary)] hover:underline mt-2"
 > <IconExternalLink size={14} />
 Next.js Redirects
 </a> </div> </div> </div> </FadeIn>
 );
}
