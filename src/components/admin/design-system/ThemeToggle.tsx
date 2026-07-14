"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { Button } from "./Button";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
 const { theme, setTheme } = useTheme();
 const [mounted, setMounted] = React.useState(false);

 React.useEffect(() => setMounted(true), []);

 if (!mounted) {
 return <Button variant="ghost" size="icon-sm" aria-label="Toggle theme"><span className="w-4 h-4" /></Button>;
 }

 const isDark = theme === "dark";

 return (
 <Button
 variant="ghost"
 size="icon-sm"
 onClick={() => setTheme(isDark ? "light" : "dark")}
 className="relative overflow-hidden"
 aria-label="Toggle theme"
 > <AnimatePresence mode="wait" initial={false}>
 {isDark ? (
 <motion.span key="moon" initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} transition={{ duration: 0.15 }}> <IconMoon size={16} /> </motion.span>
 ) : (
 <motion.span key="sun" initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} transition={{ duration: 0.15 }}> <IconSun size={16} /> </motion.span>
 )}
 </AnimatePresence> </Button>
 );
}
