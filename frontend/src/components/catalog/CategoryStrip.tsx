import { Link } from "react-router-dom";
import { categories } from "../../data/catalog";

export function CategoryStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {categories.map((category) => (
        <Link
          key={category.slug}
          className="overflow-hidden rounded-lg border border-[#6f5545]/20 bg-white shadow-[0_10px_34px_rgba(73,54,39,0.07)]"
          to={`/shop?category=${category.slug}`}
        >
          <img className="aspect-[1/1.08] object-cover" src={category.image} alt={category.name} loading="lazy" />
          <div className="p-4">
            <h3 className="font-display text-2xl">{category.name}</h3>
            <p className="mt-2 leading-6 text-[#8c7768]">{category.intro}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
