import { Briefcase, CloudSun, Gift, MessageCircle, Plane, Sparkles, Store, Timer, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CategoryStrip } from "../components/catalog/CategoryStrip";
import { ProductCard } from "../components/catalog/ProductCard";
import { Button } from "../components/ui/button";
import { products } from "../data/catalog";
import { whatsappLink } from "../lib/whatsapp";

export function HomePage() {
  return (
    <main>
      <section className="relative grid min-h-[590px] items-center overflow-hidden border-b border-[#6f5545]/20 bg-[linear-gradient(90deg,rgba(251,245,234,0.98),rgba(251,245,234,0.9)_45%,rgba(251,245,234,0.35)),url('https://laces-n-heels-luxe.vercel.app/assets/cat-bags-DfRhb7t2.jpg')] bg-[length:auto,min(430px,38vw)] bg-[position:center,right_7vw_center] bg-no-repeat px-[5vw] py-16 max-lg:bg-[linear-gradient(180deg,rgba(251,245,234,0.98),rgba(251,245,234,0.84)_55%,rgba(251,245,234,0.25)),url('https://laces-n-heels-luxe.vercel.app/assets/cat-bags-DfRhb7t2.jpg')] max-lg:bg-[length:auto,min(330px,82vw)] max-lg:bg-[position:center,right_5vw_bottom_24px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 mx-auto w-full max-w-[1180px]"
        >
          <p className="eyebrow">Curated style for everyday plans</p>
          <h1 className="max-w-3xl font-display text-5xl leading-none md:text-7xl">Curated Fashion, Bags & Travel Essentials</h1>
          <p className="lead mt-5">Shop stylish fashion pieces, bags, shoes, suitcases, and everyday accessories selected for quality, confidence, and effortless style.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/shop">
                <Sparkles className="h-5 w-5" />
                Shop Collection
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <a href={whatsappLink("the collection")} target="_blank" rel="noreferrer">
                <MessageCircle className="h-5 w-5" />
                Order on WhatsApp
              </a>
            </Button>
          </div>
          <div className="mt-7 flex max-w-3xl flex-wrap gap-2">
            {[
              [Sparkles, "Limited stylish finds"],
              [Truck, "Pickup and delivery available"],
              [Store, "Real stock / real shop"],
            ].map(([Icon, label]) => (
              <span key={label as string} className="inline-flex items-center gap-2 rounded-full border border-[#6f5545]/20 bg-white/80 px-4 py-2 text-sm font-extrabold text-[#6f5545]">
                <Icon className="h-4 w-4" />
                {label as string}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="section">
        <div className="section-inner">
          <SectionHeading eyebrow="Shop by category" title="Find what fits today" action={<Button asChild variant="secondary"><Link to="/shop">View all</Link></Button>} />
          <CategoryStrip />
        </div>
      </section>

      <section className="section bg-gradient-to-b from-cream to-ivory">
        <div className="section-inner">
          <SectionHeading eyebrow="Featured products" title="Selected for easy ordering" action={<Button asChild variant="secondary"><a href={whatsappLink("a featured product")}>Message us</a></Button>} />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{products.slice(0, 4).map((product) => <ProductCard key={product.slug} product={product} />)}</div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <SectionHeading eyebrow="Why shop with us" title="Built for trust and quick decisions" />
          <div className="grid gap-4 lg:grid-cols-5">
            {[
              [Sparkles, "Curated quality pieces", "Products are selected for style, usefulness, and finish."],
              [Truck, "Pickup and delivery available", "Choose the option that works best after confirming stock."],
              [Timer, "Limited stylish finds", "Many pieces are stocked in small quantities, so availability matters."],
              [MessageCircle, "Easy ordering via WhatsApp", "Ask questions, confirm colours, and complete your order in chat."],
              [Store, "Real stock / real shop", "The site works as a digital shop assistant for current finds."],
            ].map(([Icon, title, copy]) => (
              <article key={title as string} className="rounded-lg border border-[#6f5545]/20 bg-white p-5 shadow-[0_10px_34px_rgba(73,54,39,0.07)]">
                <Icon className="h-7 w-7 text-[#9f7131]" />
                <h3 className="mt-4 font-display text-xl">{title as string}</h3>
                <p className="mt-2 leading-7 text-[#8c7768]">{copy as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-gradient-to-b from-cream to-ivory">
        <div className="section-inner grid items-center gap-9 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-h-[420px] rounded-lg bg-[url('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1300&q=82')] bg-cover bg-center shadow-soft md:min-h-[560px]" />
          <div>
            <p className="eyebrow">Lifestyle styling</p>
            <h2 className="font-display text-4xl leading-tight md:text-6xl">For travel, work, gifting, and everyday plans</h2>
            <p className="lead mt-5">Browse pieces in the context customers actually shop for: weekend plans, office polish, cold season layering, travel prep, and thoughtful gifting.</p>
            <div className="mt-7 grid gap-3 font-extrabold text-[#6f5545]">
              {[
                [Plane, "Travel and suitcase essentials"],
                [Briefcase, "Work-ready bags and shoes"],
                [Gift, "Giftable accessories and sets"],
                [CloudSun, "Cold season ponchos and layers"],
              ].map(([Icon, label]) => (
                <span key={label as string} className="flex items-center gap-3 border-b border-[#6f5545]/20 py-3">
                  <Icon className="h-5 w-5" />
                  {label as string}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-[5vw] py-20 text-center text-ivory">
        <h2 className="font-display text-4xl md:text-6xl">Seen something you like?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-ivory/75">Message us to check availability, colours, delivery options, or pickup timing before ordering.</p>
        <Button asChild className="mt-7">
          <a href={whatsappLink("an item I saw")} target="_blank" rel="noreferrer">
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        </Button>
      </section>
    </main>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="font-display text-4xl leading-tight md:text-6xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
