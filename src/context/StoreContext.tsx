"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

export interface CartItem {
 id: string;
 variantId?: string;
 title: string;
 price: number;
 image: string;
 quantity: number;
 size?: string;
 color?: string;
 collection?: string;
 variantImages?: string[];
}

export interface WishlistItem {
 id: string;
 title: string;
 price: number;
 image: string;
 collection?: string;
}

interface StoreContextType {
 cart: CartItem[];
 wishlist: WishlistItem[];
 addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
 removeFromCart: (id: string, size?: string, color?: string) => void;
 updateQuantity: (id: string, qty: number, size?: string, color?: string) => void;
 toggleWishlist: (item: WishlistItem) => void;
 isInWishlist: (id: string) => boolean;
 cartCount: number;
 cartSubtotal: number;
 isCartOpen: boolean;
 setCartOpen: (open: boolean) => void;
 clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
 const [cart, setCart] = useState<CartItem[]>([]);
 const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
 const [isCartOpen, setCartOpen] = useState(false);

 // Load from local storage on client mount
 useEffect(() => {
 const savedCart = localStorage.getItem("soft_muse_cart");
 const savedWishlist = localStorage.getItem("soft_muse_wishlist");
 
 try {
 const parsedCart = savedCart ? JSON.parse(savedCart) : [];
 const parsedWishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
 setCart(Array.isArray(parsedCart) ? parsedCart.filter((item) => item?.id && Number(item.quantity) > 0).map((item) => ({ ...item, quantity: Math.min(20, Math.max(1, Math.floor(Number(item.quantity)))) })) : []);
 setWishlist(Array.isArray(parsedWishlist) ? parsedWishlist.filter((item) => item?.id) : []);
 } catch {
 localStorage.removeItem("soft_muse_cart");
 localStorage.removeItem("soft_muse_wishlist");
 }
 }, []);

 const saveCart = useCallback((newCart: CartItem[]) => {
 setCart(newCart);
 localStorage.setItem("soft_muse_cart", JSON.stringify(newCart));
 }, []);

 const clearCart = useCallback(() => {
 saveCart([]);
 }, [saveCart]);

 const addToCart = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
 const safeQuantity = Math.min(20, Math.max(1, Math.floor(quantity)));
 setCart((prevCart) => {
 const existingIndex = prevCart.findIndex(
 (i) => i.id === item.id && i.variantId === item.variantId && i.size === item.size && i.color === item.color
 );
 let newCart;
 if (existingIndex > -1) {
 newCart = [...prevCart];
 newCart[existingIndex] = { ...newCart[existingIndex], quantity: Math.min(20, newCart[existingIndex].quantity + safeQuantity) };
 } else {
 newCart = [...prevCart, { ...item, quantity: safeQuantity }];
 }
 localStorage.setItem("soft_muse_cart", JSON.stringify(newCart));
 return newCart;
 });
 setCartOpen(true);
 }, []);

 const removeFromCart = useCallback((id: string, size?: string, color?: string) => {
 setCart((prevCart) => {
 const newCart = prevCart.filter((i) => !(i.id === id && i.size === size && i.color === color));
 localStorage.setItem("soft_muse_cart", JSON.stringify(newCart));
 return newCart;
 });
 }, []);

 const updateQuantity = useCallback((id: string, qty: number, size?: string, color?: string) => {
 if (qty <= 0) {
 removeFromCart(id, size, color);
 return;
 }
 setCart((prevCart) => {
 const safeQuantity = Math.min(20, Math.max(1, Math.floor(qty)));
 const newCart = prevCart.map((i) =>
 i.id === id && i.size === size && i.color === color ? { ...i, quantity: safeQuantity } : i
 );
 localStorage.setItem("soft_muse_cart", JSON.stringify(newCart));
 return newCart;
 });
 }, [removeFromCart]);

 const toggleWishlist = useCallback((item: WishlistItem) => {
 setWishlist((prev) => {
 const exists = prev.some((i) => i.id === item.id);
 let newWishlist;
 if (exists) {
 newWishlist = prev.filter((i) => i.id !== item.id);
 } else {
 newWishlist = [...prev, item];
 }
 localStorage.setItem("soft_muse_wishlist", JSON.stringify(newWishlist));
 return newWishlist;
 });
 }, []);

 const isInWishlist = useCallback((id: string) => {
 return wishlist.some((i) => i.id === id);
 }, [wishlist]);

 const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
 const cartSubtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

 const contextValue = useMemo(() => ({
 cart,
 wishlist,
 addToCart,
 removeFromCart,
 updateQuantity,
 toggleWishlist,
 isInWishlist,
 cartCount,
 cartSubtotal,
 isCartOpen,
 setCartOpen,
 clearCart,
 }), [cart, wishlist, addToCart, removeFromCart, updateQuantity, toggleWishlist, isInWishlist, cartCount, cartSubtotal, isCartOpen, clearCart]);

 return (
 <StoreContext.Provider value={contextValue}>
 {children}
 </StoreContext.Provider>
 );
}

export function useStore() {
 const context = useContext(StoreContext);
 if (!context) {
 throw new Error("useStore must be used within a StoreProvider");
 }
 return context;
}
