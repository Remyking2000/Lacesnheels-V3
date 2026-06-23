import { Heart, MessageCircle, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { StorefrontProduct } from "../../hooks/useStorefront";
import { whatsappLink } from "../../lib/whatsapp";
import { useCartStore } from "../../store/cart-store";
import { useWishlistStore } from "../../store/wishlist-store";
import { Button } from "../ui/button";

export function ProductCard({ product }: { product: StorefrontProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const inCart = useCartStore((state) => state.items.includes(product.slug));
  const toggleWish = useWishlistStore((state) => state.toggle);
  const wished = useWishlistStore((state) => state.items.includes(product.slug));

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-[#6f5545]/20 bg-white shadow-[0_10px_34px_rgba(73,54,39,0.07)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(73,54,39,0.18)]">
      {/* Image */}
      <Link className="relative overflow-hidden bg-cream" to={`/shop/${product.slug}`}>
        {product.label && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase text-[#9f7131] sm:px-3 sm:text-[11px]">
            {product.label}
          </span>
        )}
        <img
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:aspect-[1/1.08]"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4 sm:gap-3 sm:p-5">
        <p className="eyebrow mb-0 text-[10px] sm:text-xs">{product.categoryName}</p>
        <h3 className="font-display text-xl leading-tight sm:text-2xl">
          <Link to={`/shop/${product.slug}`} className="hover:text-gold transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm leading-6 text-[#8c7768] sm:leading-7">{product.details}</p>
        <div className="text-sm font-black sm:text-base">{product.price}</div>

        {/* Actions */}
        <div className="mt-auto grid gap-2 pt-1">
          <Button asChild size="sm" className="w-full">
            <a href={whatsappLink(product.name)} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              Check Availability
            </a>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={inCart ? "primary" : "secondary"}
              size="sm"
              className="w-full"
              onClick={() => {
                addItem(product.slug);
                toast.success(
                  inCart ? `${product.name} already in cart` : `${product.name} added to cart`,
                );
              }}
            >
              <ShoppingBag className="h-4 w-4 shrink-0" />
              <span className="truncate">{inCart ? "In Cart" : "Add to Cart"}</span>
            </Button>
            <Button
              variant={wished ? "primary" : "secondary"}
              size="sm"
              className="w-full"
              onClick={() => {
                toggleWish(product.slug);
                toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
              }}
            >
              <Heart className="h-4 w-4 shrink-0" />
              <span className="truncate">{wished ? "Saved" : "Wishlist"}</span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
