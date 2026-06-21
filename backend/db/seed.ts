import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories, products } from "./schema";

const seedCategories = [
  {
    slug: "bags",
    name: "Bags",
    intro: "Structured handbags, everyday totes, and event-ready clutches.",
    image: "https://laces-n-heels-luxe.vercel.app/assets/cat-bags-DfRhb7t2.jpg",
  },
  {
    slug: "ponchos",
    name: "Ponchos",
    intro: "Cold-season layers for travel, work, and weekend styling.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "suitcases",
    name: "Suitcases",
    intro: "Travel essentials for polished trips and easy packing.",
    image: "https://laces-n-heels-luxe.vercel.app/assets/cat-suitcases-B_mbAqdz.jpg",
  },
  {
    slug: "shoes",
    name: "Shoes",
    intro: "Comfortable statement pairs for daily plans and occasions.",
    image: "https://laces-n-heels-luxe.vercel.app/assets/cat-heels-BmmasMDd.jpg",
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    intro: "Fresh finds added in limited quantities.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
  },
];

const seedProducts = [
  {
    slug: "cabin-suitcase",
    name: "Cabin Travel Suitcase",
    category: "suitcases",
    price: "From KES 12,500",
    label: "Travel Essential",
    image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=900&q=82",
    colors: "Black, champagne, blush nude",
    details: "Lightweight cabin size, smooth wheels, secure zip closure.",
    condition: "New",
    availability: "Limited pieces available",
    description:
      "A polished travel suitcase for quick trips, gifting, and everyday travel plans. Message before ordering so the team can confirm the current colours and pickup or delivery window.",
  },
  {
    slug: "premium-poncho",
    name: "Premium Soft Poncho",
    category: "ponchos",
    price: "From KES 4,800",
    label: "Cold Season",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=82",
    colors: "Camel, charcoal, cream",
    details: "Soft-touch knit, relaxed fit, easy layering.",
    condition: "New",
    availability: "Check availability before ordering",
    description:
      "A cozy but elevated layer for work days, travel, weekend plans, and gifting. Designed to feel warm without making the outfit look heavy.",
  },
  {
    slug: "leather-handbag",
    name: "Structured Leather Handbag",
    category: "bags",
    price: "From KES 7,900",
    label: "Limited",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=82",
    colors: "Tan, black, burgundy",
    details: "Structured shape, top handle, detachable strap.",
    condition: "New",
    availability: "Limited pieces available",
    description:
      "A clean everyday handbag that works for office looks, lunch plans, and polished errands. Ask about current stock because colours move quickly.",
  },
  {
    slug: "ladies-shoes",
    name: "Classic Ladies Shoes",
    category: "shoes",
    price: "From KES 5,500",
    label: "New Arrival",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=82",
    colors: "Black, nude, gold",
    details: "Comfortable heel height, occasion-ready finish.",
    condition: "New",
    availability: "Sizes sell fast",
    description:
      "Elegant shoes for events, work outfits, and refined everyday styling. Message with your size to confirm what is currently available.",
  },
  {
    slug: "weekend-tote",
    name: "Everyday Weekend Tote",
    category: "bags",
    price: "From KES 6,200",
    label: "Everyday",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=82",
    colors: "Beige, black, brown",
    details: "Roomy interior, soft handles, practical compartments.",
    condition: "New",
    availability: "Available while stock lasts",
    description:
      "A roomy tote for work, shopping, travel extras, and simple gifting. It is easy to style and practical for daily use.",
  },
  {
    slug: "gift-accessory-set",
    name: "Gift Accessory Set",
    category: "new-arrivals",
    price: "From KES 3,500",
    label: "Gift Pick",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=82",
    colors: "Assorted",
    details: "Curated accessories, gift-ready packaging options.",
    condition: "New",
    availability: "Ask for current sets",
    description:
      "A simple giftable set for birthdays, thank-you moments, weekend visits, and personal treats. Ask what combinations are available today.",
  },
];

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

await db.delete(products);
await db.delete(categories);

await db.insert(categories).values(
  seedCategories.map((category) => ({
    slug: category.slug,
    name: category.name,
    intro: category.intro,
    imageUrl: category.image,
  })),
);

await db.insert(products).values(
  seedProducts.map((product, index) => ({
    slug: product.slug,
    name: product.name,
    categorySlug: product.category,
    priceLabel: product.price,
    badgeLabel: product.label,
    imageUrl: product.image,
    colors: product.colors,
    details: product.details,
    condition: product.condition,
    availability: product.availability,
    description: product.description,
    featured: index < 4,
    sortOrder: index + 1,
  })),
);

console.log(`Seeded ${seedCategories.length} categories and ${seedProducts.length} products.`);
