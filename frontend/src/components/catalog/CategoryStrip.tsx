import { Link } from "react-router-dom";
import { useStorefrontCategories } from "../../hooks/useStorefront";

export function CategoryStrip() {
  const { data: categories = [] } = useStorefrontCategories();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
      {categories.map((category) => (
        <Link
          key={category.slug}
          className="group overflow-hidden rounded-lg border border-[#6f5545]/20 bg-white shadow-[0_10px_34px_rgba(73,54,39,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(73,54,39,0.15)]"
          to={`/shop?category=${category.slug}`}
        >
          <div className="overflow-hidden">
            <img
              className="aspect-[1/1.08] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={category.image}
              alt={category.name}
              loading="lazy"
            />
          </div>
          <div className="p-3 sm:p-4">
            <h3 className="font-display text-lg sm:text-2xl">{category.name}</h3>
            <p className="mt-1 hidden text-sm leading-6 text-[#8c7768] sm:mt-2 sm:block sm:leading-6">
              {category.intro}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
