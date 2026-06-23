import {
  Briefcase,
  CloudSun,
  Gift,
  MessageCircle,
  Plane,
  Sparkles,
  Store,
  Timer,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CategoryStrip } from "../components/catalog/CategoryStrip";
import { ProductCard } from "../components/catalog/ProductCard";
import { Button } from "../components/ui/button";
import { useStorefrontProducts } from "../hooks/useStorefront";
import { whatsappLink } from "../lib/whatsapp";

export function HomePage() {
  const { data: products = [] } = useStorefrontProducts();
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const displayProducts = featured.length >= 4 ? featured : products.slice(0, 4);
  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative flex min-h-[520px] items-center overflow-hidden border-b border-[#6f5545]/20 px-4 py-14 sm:min-h-[590px] sm:px-[5vw] sm:py-16">
        {/* Full-bleed background */}
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-[center_30%]"
          aria-hidden="true"
        />
        {/* Gradient overlay — horizontal on desktop, vertical on mobile */}
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,245,234,0.97)_0%,rgba(251,245,234,0.88)_50%,rgba(251,245,234,0.45)_100%)] sm:bg-[linear-gradient(90deg,rgba(251,245,234,0.96)_0%,rgba(251,245,234,0.80)_40%,rgba(251,245,234,0.30)_70%,rgba(251,245,234,0.10)_100%)]"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 mx-auto w-full max-w-[1180px]"
        >
          <p className="eyebrow">Curated style for everyday plans</p>
          <h1 className="max-w-3xl font-display text-4xl leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Curated Fashion, Bags &amp; Travel Essentials
          </h1>
          <p className="lead mt-4 sm:mt-5">
            Shop stylish fashion pieces, bags, shoes, suitcases, and everyday accessories
            selected for quality, confidence, and effortless style.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Button asChild className="w-full sm:w-auto">
              <Link to="/shop">
                <Sparkles className="h-5 w-5" />
                Shop Collection
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <a href={whatsappLink("the collection")} target="_blank" rel="noreferrer">
                <MessageCircle className="h-5 w-5" />
                Order on WhatsApp
              </a>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 sm:mt-7">
            {[
              [Sparkles, "Limited stylish finds"],
              [Truck, "Pickup and delivery available"],
              [Store, "Real stock / real shop"],
            ].map(([Icon, label]) => (
              <span
                key={label as string}
                className="inline-flex items-center gap-2 rounded-full border border-[#6f5545]/20 bg-white/80 px-3 py-1.5 text-xs font-extrabold text-[#6f5545] sm:px-4 sm:py-2 sm:text-sm"
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {label as string}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Categories ── */}
      <section className="section">
        <div className="section-inner">
          <SectionHeading
            eyebrow="Shop by category"
            title="Find what fits today"
            action={
              <Button asChild variant="secondary">
                <Link to="/shop">View all</Link>
              </Button>
            }
          />
          <CategoryStrip />
        </div>
      </section>

      {/* ── Featured products ── */}
      <section className="section bg-gradient-to-b from-cream to-ivory">
        <div className="section-inner">
          <SectionHeading
            eyebrow="Featured products"
            title="Selected for easy ordering"
            action={
              <Button asChild variant="secondary">
                <a href={whatsappLink("a featured product")}>Message us</a>
              </Button>
            }
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust signals ── */}
      <section className="section">
        <div className="section-inner">
          <SectionHeading eyebrow="Why shop with us" title="Built for trust and quick decisions" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              [Sparkles, "Curated quality pieces", "Products are selected for style, usefulness, and finish."],
              [Truck, "Pickup and delivery available", "Choose the option that works best after confirming stock."],
              [Timer, "Limited stylish finds", "Many pieces are stocked in small quantities, so availability matters."],
              [MessageCircle, "Easy ordering via WhatsApp", "Ask questions, confirm colours, and complete your order in chat."],
              [Store, "Real stock / real shop", "The site works as a digital shop assistant for current finds."],
            ].map(([Icon, title, copy]) => (
              <article
                key={title as string}
                className="rounded-lg border border-[#6f5545]/20 bg-white p-5 shadow-[0_10px_34px_rgba(73,54,39,0.07)]"
              >
                <Icon className="h-7 w-7 text-[#9f7131]" />
                <h3 className="mt-4 font-display text-xl">{title as string}</h3>
                <p className="mt-2 leading-7 text-[#8c7768]">{copy as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lifestyle split ── */}
      <section className="section bg-gradient-to-b from-cream to-ivory">
        <div className="section-inner grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-9">
          {/* Image — shown below text on mobile, left on desktop */}
          <div
            className="order-2 min-h-[260px] rounded-lg bg-[url('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1300&q=82')] bg-cover bg-center shadow-soft sm:min-h-[380px] md:min-h-[480px] lg:order-1 lg:min-h-[560px]"
            aria-label="Fashion lifestyle photo"
            role="img"
          />
          <div className="order-1 lg:order-2">
            <p className="eyebrow">Lifestyle styling</p>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              For travel, work, gifting, and everyday plans
            </h2>
            <p className="lead mt-4 sm:mt-5">
              Browse pieces in the context customers actually shop for: weekend plans, office
              polish, cold season layering, travel prep, and thoughtful gifting.
            </p>
            <div className="mt-6 grid gap-1 font-extrabold text-[#6f5545] sm:mt-7">
              {[
                [Plane, "Travel and suitcase essentials"],
                [Briefcase, "Work-ready bags and shoes"],
                [Gift, "Giftable accessories and sets"],
                [CloudSun, "Cold season ponchos and layers"],
              ].map(([Icon, label]) => (
                <span
                  key={label as string}
                  className="flex items-center gap-3 border-b border-[#6f5545]/20 py-3 text-sm sm:text-base"
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {label as string}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="bg-charcoal px-4 py-16 text-center text-ivory sm:px-[5vw] sm:py-20">
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl">
          Seen something you like?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-ivory/75 sm:text-base">
          Message us to check availability, colours, delivery options, or pickup timing before
          ordering.
        </p>
        <Button asChild className="mt-6 w-full max-w-xs sm:mt-7 sm:w-auto">
          <a href={whatsappLink("an item I saw")} target="_blank" rel="noreferrer">
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        </Button>
      </section>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4 sm:mb-8 sm:gap-5">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="font-display text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
