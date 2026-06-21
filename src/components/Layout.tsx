import { Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { CommandMenu } from "./catalog/CommandMenu";
import { Button } from "./ui/button";
import { whatsappLink } from "../lib/whatsapp";
import { useCartStore } from "../store/cart-store";

const navItems = [
  { to: "/shop", label: "Shop" },
  { to: "/shop?category=new-arrivals", label: "New Arrivals" },
  { to: "/shop?category=bags", label: "Bags" },
  { to: "/shop?category=suitcases", label: "Suitcases" },
  { to: "/admin", label: "Admin" },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const itemCount = useCartStore((state) => state.items.length);

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <header className="sticky top-0 z-40 border-b border-[#6f5545]/20 bg-ivory/95 px-[5vw] backdrop-blur">
        <div className="mx-auto flex min-h-[72px] max-w-[1180px] items-center justify-between gap-4">
          <Link to="/" className="font-display text-xl font-bold uppercase tracking-0">
            Laces <span className="text-gold">&</span> Heels
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-black uppercase text-[#6f5545] lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.to} className="hover:text-[#9f7131]">
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Search products" onClick={() => setCommandOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Cart">
              <Link to="/shop">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 ? <span className="sr-only">{itemCount} saved items</span> : null}
              </Link>
            </Button>
            <Button asChild size="sm" className="hidden md:inline-flex">
              <a href={whatsappLink("the collection")} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
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

        {menuOpen ? (
          <nav className="grid gap-1 border-t border-[#6f5545]/20 py-4 text-sm font-black uppercase text-[#6f5545] lg:hidden">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} className="py-3" onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <Outlet />
      <Footer />
      <a
        className="fixed bottom-5 right-5 z-50 inline-grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lg"
        href={whatsappLink("an item I saw")}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-espresso px-[5vw] py-12 text-ivory/75">
      <div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div>
          <h3 className="font-display text-2xl text-ivory">Laces & Heels</h3>
          <p className="mt-3 leading-7">Curated fashion, bags, shoes, suitcases, and lifestyle accessories selected for effortless style.</p>
        </div>
        {[
          ["Shop", "All Products", "New Arrivals", "Suitcases", "Bags"],
          ["Order", "WhatsApp Orders", "Check Availability", "Pickup & Delivery"],
          ["Visit", "hello@lacesnheels.com", "Chat on WhatsApp", "Instagram: @lacesnheels"],
        ].map(([heading, ...links]) => (
          <div key={heading}>
            <h4 className="font-bold text-ivory">{heading}</h4>
            <div className="mt-3 grid gap-2">
              {links.map((link) => (
                <a key={link} href={link.includes("@") ? "mailto:hello@lacesnheels.com" : whatsappLink(link)}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
