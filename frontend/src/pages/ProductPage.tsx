import { MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/catalog/ProductCard";
import { Button } from "../components/ui/button";
import { categoryName, productBySlug, products } from "../data/catalog";
import { whatsappLink } from "../lib/whatsapp";

export function ProductPage() {
  const { slug } = useParams();
  const product = productBySlug(slug);

  if (!product) {
    return (
      <main className="section">
        <div className="section-inner rounded-lg border border-[#6f5545]/20 bg-white px-6 py-12 text-center sm:p-12">
          <h1 className="font-display text-4xl sm:text-5xl">Product not found</h1>
          <p className="mx-auto mt-3 max-w-xl text-[#8c7768]">
            This item may have sold out or moved. Message us to check current stock.
          </p>
          <Button asChild className="mt-6 w-full sm:w-auto">
            <a href={whatsappLink("current stock")}>Check Availability</a>
          </Button>
        </div>
      </main>
    );
  }

  const related = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 3);

  return (
    <main>
      {/* ── Product detail ── */}
      <section className="section">
        <div className="section-inner grid gap-8 lg:grid-cols-[0.95fr_1fr] lg:gap-10">
          {/* Product image */}
          <div className="overflow-hidden rounded-lg border border-[#6f5545]/20 bg-cream shadow-soft">
            <img
              className="aspect-square w-full object-cover sm:aspect-[1/1.08]"
              src={product.image}
              alt={product.name}
            />
          </div>

          {/* Product info */}
          <article className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow">{product.label}</p>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {product.name}
            </h1>
            <p className="lead mt-4 font-black sm:mt-5">{product.price}</p>

            {/* CTAs — stacked on mobile, inline on sm+ */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-7 sm:flex sm:flex-wrap">
              <Button asChild className="w-full sm:w-auto">
                <a href={whatsappLink(product.name)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Order on WhatsApp
                </a>
              </Button>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <a href={whatsappLink(`${product.name} delivery`)}>Ask About Delivery</a>
              </Button>
            </div>

            {/* Specs table */}
            <div className="my-6 grid gap-0 sm:my-7">
              {[
                ["Available colours", product.colors],
                ["Size/details", product.details],
                ["Condition", product.condition],
                ["Availability", product.availability],
                ["Pickup/delivery", "Available after confirmation"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex min-h-[48px] items-start justify-between gap-4 border-b border-[#6f5545]/20 py-3 text-sm text-[#6f5545] sm:text-base"
                >
                  <span className="shrink-0">{label}</span>
                  <strong className="text-right text-charcoal">{value}</strong>
                </div>
              ))}
            </div>

            <p className="text-sm leading-7 text-[#6f5545] sm:text-base sm:leading-8">
              {product.description}
            </p>
          </article>
        </div>
      </section>

      {/* ── Related products ── */}
      <section className="section bg-gradient-to-b from-cream to-ivory">
        <div className="section-inner">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-8 sm:gap-5">
            <div>
              <p className="eyebrow">Related products</p>
              <h2 className="font-display text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                More from {categoryName(product.category)}
              </h2>
            </div>
            <Button asChild variant="secondary">
              <Link to={`/shop?category=${product.category}`}>View category</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {(related.length
              ? related
              : products.filter((item) => item.slug !== product.slug).slice(0, 3)
            ).map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
