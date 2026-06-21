export type CategorySlug = "bags" | "ponchos" | "suitcases" | "shoes" | "new-arrivals";

export type Category = {
  slug: CategorySlug;
  name: string;
  intro: string;
  image: string;
};

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  price: string;
  label: string;
  image: string;
  colors: string;
  details: string;
  condition: string;
  availability: string;
  description: string;
};
