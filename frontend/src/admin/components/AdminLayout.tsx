import {
  BarChart3,
  BoxIcon,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store/auth-store";
import { cn } from "../../lib/utils";
import { format } from "date-fns";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: BoxIcon },
  { to: "/admin/categories", label: "Categories", icon: FolderOpen },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const futureItems = [
  { label: "Customers", icon: Users },
  { label: "Analytics", icon: BarChart3 },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden dark:bg-gray-950">
      {/* ── Sidebar backdrop (mobile) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-espresso text-ivory transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="font-display text-lg font-bold leading-tight text-ivory">
              Laces &amp; Heels
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gold">
              Admin Panel
            </p>
          </div>
          <button
            className="rounded-md p-1 text-ivory/60 hover:text-ivory lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-widest text-ivory/40">
            Main
          </p>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-gold/20 text-gold"
                    : "text-ivory/70 hover:bg-white/5 hover:text-ivory",
                )
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="h-4.5 w-4.5 h-[18px] w-[18px] shrink-0" />
              {label}
            </NavLink>
          ))}

          <p className="mb-2 mt-6 px-3 text-[10px] font-black uppercase tracking-widest text-ivory/40">
            Coming Soon
          </p>
          {futureItems.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-ivory/30 cursor-not-allowed"
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {label}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-ivory/70 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col min-w-0 max-w-full overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 overflow-hidden dark:border-gray-800 dark:bg-gray-900 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden text-xs text-gray-400 sm:block">
              {format(new Date(), "EEE, MMM d yyyy")}
            </span>

            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-xs font-black text-white">
                A
              </div>
              <span className="hidden text-sm font-semibold text-gray-700 dark:text-gray-200 sm:block">
                Admin
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 min-w-0 overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
