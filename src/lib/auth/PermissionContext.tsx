"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthService, type AuthenticatedUser } from "@/lib/services/auth.service";
import { eventBus } from "@/lib/events/EventBus";

export type PermissionAction = "read" | "write" | "delete" | "impersonation";
export type PermissionModule = "dashboard" | "analytics" | "products" | "inventory" | "orders" | "customers" | "finance" | "marketing" | "storefront" | "settings" | "system";
type ModulePermission = { read: boolean; write: boolean; delete: boolean; impersonation?: boolean };
export interface AdminRole { id: string; nameAr: string; permissions: Record<string, ModulePermission>; }

const PERMISSION_TO_MODULE: Record<string, PermissionModule> = {
  "dashboard.view": "dashboard", "analytics.view": "analytics", "orders.view": "orders",
  "customers.view": "customers", "products.view": "products", "reviews.view": "products",
  "inventory.view": "inventory", "procurement.view": "inventory", "finance.view": "finance",
  "marketing.view": "marketing", "website.view": "storefront", "admin.view": "settings",
};

const ROUTE_MODULE: Array<[string, PermissionModule | null]> = [
  ["/admin/profile", null], ["/admin/users", "system"], ["/admin/settings", "settings"],
  ["/admin/business", "finance"], ["/admin/website", "storefront"], ["/admin/soft-muse", "storefront"],
  ["/admin/journal", "storefront"], ["/admin/analytics", "analytics"], ["/admin/orders", "orders"],
  ["/admin/customers", "customers"], ["/admin/products", "products"], ["/admin/categories", "products"],
  ["/admin/brands", "products"], ["/admin/collections", "products"], ["/admin/reviews", "products"], ["/admin/inventory", "inventory"],
  ["/admin/coupons", "marketing"], ["/admin", "dashboard"],
];

export function moduleForPath(pathname: string): PermissionModule | null {
  return ROUTE_MODULE.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`))?.[1] ?? "dashboard";
}

export function moduleForSidebarPermission(permission?: string): PermissionModule | null {
  return permission ? PERMISSION_TO_MODULE[permission] ?? null : null;
}

const modules: PermissionModule[] = ["dashboard", "analytics", "products", "inventory", "orders", "customers", "finance", "marketing", "storefront", "settings", "system"];

function roleFor(user: AuthenticatedUser | null): AdminRole | null {
  if (!user) return null;
  const isAdmin = user.isSuperAdmin;
  const isManager = user.roleId === "role_2";
  const editorRead = ["dashboard", "products", "storefront"];
  const permissions = Object.fromEntries(modules.map((module) => [module, {
    read: isAdmin || (isManager && module !== "system") || editorRead.includes(module),
    write: isAdmin || (isManager && module !== "system") || ["products", "storefront"].includes(module),
    delete: isAdmin,
    impersonation: false,
  }])) as Record<string, ModulePermission>;
  return { id: user.roleId, nameAr: user.roleNameAr, permissions };
}

interface PermissionContextValue {
  loaded: boolean;
  roles: AdminRole[];
  actualRoleId: string;
  viewAsRoleId: string;
  effectiveRole: AdminRole | null;
  isViewingAs: boolean;
  setViewAsRoleId: (id: string) => void;
  can: (module: PermissionModule, action?: PermissionAction) => boolean;
  canAccessModule: (module: PermissionModule | null) => boolean;
  canImpersonate: boolean;
  user: AuthenticatedUser | null;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setUser(AuthService.getCurrentUser());
    setLoaded(true);
    return eventBus.subscribe("user.updated", (updated) => setUser(updated as AuthenticatedUser));
  }, []);

  const role = useMemo(() => roleFor(user), [user]);
  const can = useCallback((module: PermissionModule, action: PermissionAction = "read") => {
    if (!loaded) return false;
    const permission = role?.permissions[module];
    if (!permission) return false;
    return action === "impersonation" ? false : Boolean(permission[action]);
  }, [loaded, role]);
  const canAccessModule = useCallback((module: PermissionModule | null) => module === null || can(module), [can]);

  return (
    <PermissionContext.Provider value={{
      loaded, roles: role ? [role] : [], actualRoleId: role?.id ?? "", viewAsRoleId: role?.id ?? "",
      effectiveRole: role, isViewingAs: false, setViewAsRoleId: () => undefined,
      can, canAccessModule, canImpersonate: false, user,
    }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const value = useContext(PermissionContext);
  if (!value) throw new Error("usePermissions phải được dùng trong PermissionProvider.");
  return value;
}
