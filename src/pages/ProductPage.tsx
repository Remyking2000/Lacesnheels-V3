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
        <div className="section-inner rounded-lg border border-[#6f5545]/20 bg-white p-12 text-center">
          <h1 className="font-display text-5xl">Product not found</h1>
          <p className="mx-auto mt-3 max-w-xl text-[#8c7768]">This item may have sold out or moved. Message us to check current stock.</p>
          <Button asChild className="mt-6"><a href={whatsappLink("current stock")}>Check Availability</a></Button>
        </div>
      </main>
    );
  }

  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 3);

  return (
    <main>
      <section className="section">
        <div className="section-inner grid gap-10 lg:grid-cols-[0.95fr_1fr]">
          <div className="overflow-hidden rounded-lg border border-[#6f5545]/20 bg-cream shadow-soft">
            <img className="aspect-[1/1.08] h-full object-cover" src={product.image} alt={product.name} />
          </div>
          <article className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow">{product.label}</p>
            <h1 className="font-display text-5xl leading-none md:text-7xl">{product.name}</h1>
            <p className="lead mt-5 font-black">{product.price}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <a href={whatsappLink(product.name)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Order on WhatsApp
                </a>
              </Button>
              <Button asChild variant="secondary"><a href={whatsappLink(`${product.name} delivery`)}>Ask About Delivery</a></Button>
            </div>
            <div className="my-7 grid gap-2">
              {[
                ["Available colours", product.colors],
                ["Size/details", product.details],
                ["Condition", product.condition],
                ["Availability", product.availability],
                ["Pickup/delivery", "Available after confirmation"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-5 border-b border-[#6f5545]/20 py-3 text-[#6f5545]">
                  <span>{label}</span>
                  <strong className="text-right text-charcoal">{value}</strong>
                </div>
              ))}
            </div>
            <p className="leading-8 text-[#6f5545]">{product.description}</p>
          </article>
        </div>
      </section>

      <section className="section bg-gradient-to-b from-cream to-ivory">
        <div className="section-inner">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow">Related products</p>
              <h2 className="font-display text-4xl md:text-6xl">More from {categoryName(product.category)}</h2>
            </div>
            <Button asChild variant="secondary"><Link to={`/shop?category=${product.category}`}>View category</Link></Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {(related.length ? related : products.filter((item) => item.slug !== product.slug).slice(0, 3)).map((item) => <ProductCard key={item.slug} product={item} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
