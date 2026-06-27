import { Heart, Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { CommandMenu } from "./catalog/CommandMenu";
import { CartDrawer } from "./CartDrawer";
import { WishlistDrawer } from "./WishlistDrawer";
import { AuthButton } from "./AuthButton";
import { Button } from "./ui/button";
import { whatsappLink } from "../lib/whatsapp";
import { useCartStore } from "../store/cart-store";
import { useWishlistStore } from "../store/wishlist-store";

const navItems = [
  { to: "/shop", label: "Shop" },
  { to: "/shop?category=new-arrivals", label: "New Arrivals" },
  { to: "/shop?category=bags", label: "Bags" },
  { to: "/shop?category=shoes", label: "Shoes" },
  { to: "/shop?category=suitcases", label: "Suitcases" },
  { to: "/admin", label: "Admin" },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useWishlistStore((state) => state.items.length);

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <header className="sticky top-0 z-40 border-b border-[#6f5545]/20 bg-ivory/95 px-4 backdrop-blur sm:px-[5vw]">
        <div className="mx-auto flex min-h-[64px] max-w-[1180px] items-center justify-between gap-3 sm:min-h-[72px] sm:gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 font-display text-lg font-bold uppercase tracking-0 sm:text-xl"
          >
            Laces <span className="text-gold">&</span> Heels
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 text-xs font-black uppercase text-[#6f5545] lg:flex xl:gap-7">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className="py-1 transition-colors hover:text-[#9f7131]"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Icon actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search products"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Sign in / profile */}
            <AuthButton />

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ""}`}
              onClick={() => setWishlistOpen(true)}
              className="relative"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-black text-white">
                  {wishlistCount}
                </span>
              )}
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* WhatsApp CTA — hidden on small mobile, shown md+ */}
            <Button asChild size="sm" className="hidden md:inline-flex">
              <a href={whatsappLink("the collection")} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile slide-down nav */}
        {menuOpen && (
          <nav
            className="border-t border-[#6f5545]/20 pb-4 pt-2 lg:hidden"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex min-h-[48px] items-center px-1 text-sm font-black uppercase text-[#6f5545] transition-colors hover:text-[#9f7131]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* WhatsApp link in mobile menu */}
            <a
              href={whatsappLink("the collection")}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex min-h-[48px] items-center gap-2 rounded-full bg-gold px-5 text-sm font-black text-[#271b10]"
              onClick={() => setMenuOpen(false)}
            >
              <MessageCircle className="h-4 w-4" />
              Order on WhatsApp
            </a>
          </nav>
        )}
      </header>

      <Outlet />
      <Footer />

      {/* Floating WhatsApp button — raised above mobile browser chrome */}
      <a
        className="fixed bottom-6 right-4 z-40 inline-grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lg sm:bottom-5 sm:right-5"
        href={whatsappLink("an item I saw")}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-espresso px-4 py-12 text-ivory/75 sm:px-[5vw]">
      <div className="mx-auto grid max-w-[1180px] gap-8 sm:grid-cols-2 md:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div className="sm:col-span-2 md:col-span-1">
          <h3 className="font-display text-2xl text-ivory">Laces & Heels</h3>
          <p className="mt-3 leading-7">
            Curated fashion, bags, shoes, suitcases, and lifestyle accessories selected for
            effortless style.
          </p>
        </div>

        {[
          ["Shop", "All Products", "New Arrivals", "Suitcases", "Bags"],
          ["Order", "WhatsApp Orders", "Check Availability", "Pickup & Delivery"],
        ].map(([heading, ...links]) => (
          <div key={heading}>
            <h4 className="font-bold text-ivory">{heading}</h4>
            <div className="mt-3 grid gap-3">
              {links.map((link) => (
                <a
                  key={link}
                  href={whatsappLink(link)}
                  className="min-h-[44px] text-sm leading-[44px]"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h4 className="font-bold text-ivory">Contact</h4>
          <div className="mt-3 grid gap-3">
            <a
              href="https://wa.me/254700709002"
              target="_blank"
              rel="noreferrer"
              className="min-h-[44px] text-sm leading-[44px]"
            >
              WhatsApp: +254 700 709002
            </a>
            <a
              href="https://www.instagram.com/lacesbyray/"
              target="_blank"
              rel="noreferrer"
              className="min-h-[44px] text-sm leading-[44px]"
            >
              Instagram: @lacesbyray
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
