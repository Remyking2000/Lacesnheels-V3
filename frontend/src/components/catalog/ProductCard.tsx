import { Heart, MessageCircle, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { Product } from "../../types/catalog";
import { categoryName } from "../../data/catalog";
import { whatsappLink } from "../../lib/whatsapp";
import { useCartStore } from "../../store/cart-store";
import { useWishlistStore } from "../../store/wishlist-store";
import { Button } from "../ui/button";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWish = useWishlistStore((state) => state.toggle);
  const wished = useWishlistStore((state) => state.items.includes(product.slug));

  return (
    <article className="flex min-h-full flex-col overflow-hidden rounded-lg border border-[#6f5545]/20 bg-white shadow-[0_10px_34px_rgba(73,54,39,0.07)]">
      <Link className="relative bg-cream" to={`/shop/${product.slug}`}>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase text-[#9f7131]">
          {product.label}
        </span>
        <img className="aspect-[1/1.08] object-cover" src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="eyebrow mb-0">{categoryName(product.category)}</p>
        <h3 className="font-display text-2xl leading-tight">
          <Link to={`/shop/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="leading-7 text-[#8c7768]">{product.details}</p>
        <div className="font-black">{product.price}</div>
        <div className="mt-auto grid gap-2">
          <Button asChild size="sm">
            <a href={whatsappLink(product.name)} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" />
              Check Availability
            </a>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                addItem(product.slug);
                toast.success(`${product.name} added to cart`);
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              Save
            </Button>
            <Button
              variant={wished ? "primary" : "secondary"}
              size="sm"
              onClick={() => {
                toggleWish(product.slug);
                toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
              }}
            >
              <Heart className="h-4 w-4" />
              Wish
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
