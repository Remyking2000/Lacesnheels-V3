import { Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useCartStore } from "../store/cart-store";
import { useWishlistStore } from "../store/wishlist-store";
import { useStorefrontProducts } from "../hooks/useStorefront";
import { Button } from "./ui/button";

interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ open, onClose }: WishlistDrawerProps) {
  const { items, toggle, moveToCart } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { data: allProducts = [] } = useStorefrontProducts();

  const wishlistProducts = items
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter(Boolean) as typeof allProducts;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your wishlist"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-ivory shadow-[-24px_0_60px_rgba(48,42,37,0.18)] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#6f5545]/20 px-5 py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-gold" />
            <h2 className="font-display text-xl">Wishlist</h2>
            {items.length > 0 && (
              <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-black text-white">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close wishlist"
            className="rounded-full p-1 hover:bg-cream transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {wishlistProducts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <Heart className="h-12 w-12 text-[#6f5545]/30" />
              <p className="font-display text-2xl text-charcoal">Nothing saved yet</p>
              <p className="text-sm text-[#8c7768]">
                Tap the heart icon on any product to save it here for later.
              </p>
              <Button size="sm" onClick={onClose} asChild>
                <Link to="/shop">Browse Shop</Link>
              </Button>
            </div>
          ) : (
            <ul className="grid gap-4">
              {wishlistProducts.map((product) => (
                <li
                  key={product.slug}
                  className="flex gap-4 rounded-lg border border-[#6f5545]/15 bg-white p-3 shadow-sm"
                >
                  <Link to={`/shop/${product.slug}`} onClick={onClose} className="shrink-0">
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
                      <p className="mt-1 text-sm font-black text-charcoal">{product.price}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          moveToCart(product.slug, addToCart);
                          toast.success(`${product.name} moved to cart`);
                        }}
                        className="flex items-center gap-1.5 rounded-full border border-gold bg-white px-3 py-1.5 text-xs font-black text-gold transition-colors hover:bg-gold hover:text-white"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Move to Cart
                      </button>
                      <button
                        onClick={() => {
                          toggle(product.slug);
                          toast.success(`${product.name} removed from wishlist`);
                        }}
                        aria-label={`Remove ${product.name} from wishlist`}
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

        {/* Footer hint */}
        {wishlistProducts.length > 0 && (
          <div className="border-t border-[#6f5545]/20 px-5 py-4">
            <p className="text-xs text-center text-[#8c7768]">
              Move items to your cart and checkout via WhatsApp when you're ready to order.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
