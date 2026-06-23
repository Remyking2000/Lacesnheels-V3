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
        <h1 className="font-display text-4xl leading-tight sm:text-5xl md:text-7xl">
          Catalog overview
        </h1>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Metric label="Products" value={products.length} />
          <Metric label="Categories listed" value={categoryRows.length} />
          <Metric label="Primary channel" value="WhatsApp" />
        </div>
        <section className="mt-8 rounded-lg border border-[#6f5545]/20 bg-white p-4 shadow-soft sm:p-5">
          <h2 className="font-display text-2xl sm:text-3xl">Products by category</h2>
          <div className="mt-5 h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryRows} margin={{ left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
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
