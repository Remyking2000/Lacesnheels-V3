import { useSearchParams } from "react-router-dom";
import { useStorefrontProducts, useStorefrontCategories } from "../hooks/useStorefront";
import { ProductCard } from "../components/catalog/ProductCard";
import { Button } from "../components/ui/button";
import { whatsappLink } from "../lib/whatsapp";

export function ShopPage() {
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get("category");

  const { data: products = [] } = useStorefrontProducts();
  const { data: categories = [] } = useStorefrontCategories();

  const visibleProducts = activeCategory
    ? products.filter((p) => p.categoryKey === activeCategory)
    : products;

  const activeCategoryName = categories.find((c) => c.slug === activeCategory)?.name;
  const title = activeCategoryName ?? "Shop the collection";

  return (
    <main>
      {/* ── Page header ── */}
      <section className="bg-cream px-4 py-12 sm:px-[5vw] sm:py-16">
        <div className="section-inner">
          <p className="eyebrow">Digital shop assistant</p>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="lead mt-4 sm:mt-5">
            Browse clean product cards, check pricing, and message on WhatsApp to confirm
            current stock before ordering.
          </p>

          {/* Scrollable category filter pills */}
          <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-0 sm:mt-7 sm:flex-wrap sm:px-0">
            <FilterButton active={!activeCategory} onClick={() => setParams({})}>
              All
            </FilterButton>
            {categories.map((category) => (
              <FilterButton
                key={category.slug}
                active={activeCategory === category.slug}
                onClick={() => setParams({ category: category.slug })}
              >
                {category.name}
              </FilterButton>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product grid ── */}
      <section className="section">
        <div className="section-inner">
          {visibleProducts.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#6f5545]/20 bg-white px-6 py-12 text-center sm:p-12">
              <h2 className="font-display text-3xl sm:text-4xl">Nothing listed here yet</h2>
              <p className="mx-auto mt-3 max-w-xl text-[#8c7768]">
                Message us and we can confirm what is available today.
              </p>
              <Button asChild className="mt-6 w-full sm:w-auto">
                <a href={whatsappLink("current stock")}>Ask on WhatsApp</a>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`min-h-[44px] shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-black transition-colors ${
        active
          ? "border-gold bg-gold text-[#261a0e]"
          : "border-[#6f5545]/20 bg-white text-[#6f5545]"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
