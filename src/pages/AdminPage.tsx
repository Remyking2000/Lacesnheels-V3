import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { products } from "../data/catalog";

const categoryRows = Object.entries(
  products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {}),
).map(([category, count]) => ({ category, count }));

export function AdminPage() {
  return (
    <main className="section">
      <div className="section-inner">
        <p className="eyebrow">Admin snapshot</p>
        <h1 className="font-display text-5xl leading-none md:text-7xl">Catalog overview</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Metric label="Products" value={products.length} />
          <Metric label="Categories listed" value={categoryRows.length} />
          <Metric label="Primary channel" value="WhatsApp" />
        </div>
        <section className="mt-8 rounded-lg border border-[#6f5545]/20 bg-white p-5 shadow-soft">
          <h2 className="font-display text-3xl">Products by category</h2>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryRows}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#c79a42" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-[#6f5545]/20 bg-white p-5 shadow-[0_10px_34px_rgba(73,54,39,0.07)]">
      <p className="text-sm font-black uppercase text-[#8c7768]">{label}</p>
      <p className="mt-3 font-display text-4xl">{value}</p>
    </div>
  );
}
