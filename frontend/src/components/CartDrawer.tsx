import { MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { products } from "../data/catalog";
import { cartCheckoutLink } from "../lib/whatsapp";
import { useCartStore } from "../store/cart-store";
import { Button } from "./ui/button";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** Parse "From KES 12,500" → 12500 */
function parsePriceKES(price: string): number {
  const match = price.replace(/,/g, "").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, clear } = useCartStore();

  const cartProducts = items
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean) as typeof products;

  const total = cartProducts.reduce((sum, p) => sum + parsePriceKES(p.price), 0);

  const checkoutUrl = cartCheckoutLink(
    cartProducts.map((p) => ({ name: p.name, price: p.price })),
  );

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-ivory shadow-[-24px_0_60px_rgba(48,42,37,0.18)] transition-transform duration-300 sm:max-w-sm ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#6f5545]/20 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gold" />
            <h2 className="font-display text-xl">Your Cart</h2>
            {items.length > 0 && (
              <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-black text-white">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full p-1 hover:bg-cream transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cartProducts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag className="h-12 w-12 text-[#6f5545]/30" />
              <p className="font-display text-2xl text-charcoal">Your cart is empty</p>
              <p className="text-sm text-[#8c7768]">Browse the shop and add items you love.</p>
              <Button size="sm" onClick={onClose} asChild>
                <Link to="/shop">Browse Shop</Link>
              </Button>
            </div>
          ) : (
            <ul className="grid gap-4">
              {cartProducts.map((product) => (
                <li
                  key={product.slug}
                  className="flex gap-4 rounded-lg border border-[#6f5545]/15 bg-white p-3 shadow-sm"
                >
                  <Link to={`/shop/${product.slug}`} onClick={onClose}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <Link
                        to={`/shop/${product.slug}`}
                        onClick={onClose}
                        className="font-display text-base leading-tight hover:text-gold transition-colors line-clamp-2"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xs text-[#8c7768]">{product.details}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-black text-charcoal">{product.price}</span>
                      <button
                        onClick={() => {
                          removeItem(product.slug);
                          toast.success(`${product.name} removed from cart`);
                        }}
                        aria-label={`Remove ${product.name} from cart`}
                        className="rounded-full p-1.5 text-[#8c7768] transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cartProducts.length > 0 && (
          <div className="border-t border-[#6f5545]/20 px-5 py-4 grid gap-3">

            {/* Order total */}
            <div className="flex items-center justify-between rounded-lg bg-cream px-4 py-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#8c7768]">
                  Estimated Total
                </p>
                <p className="mt-0.5 text-[10px] text-[#8c7768]/70">
                  Final price confirmed via WhatsApp
                </p>
              </div>
              <p className="font-display text-xl font-bold text-charcoal">
                KES {total.toLocaleString()}
              </p>
            </div>

            <p className="text-xs text-[#8c7768] text-center">
              Tap Checkout to send your order via WhatsApp. We'll confirm availability and delivery.
            </p>

            <Button
              asChild
              onClick={() => {
                clear();
                onClose();
              }}
            >
              <a href={checkoutUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                Checkout via WhatsApp
              </a>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clear();
                toast.success("Cart cleared");
              }}
            >
              Clear cart
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
