import {
  AlertTriangle,
  BoxIcon,
  FolderOpen,
  Package,
  PackageX,
  Plus,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { useAdminStore } from "../store/admin-store";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { getStockStatus } from "../types";
import { exportProductsCSV } from "../lib/csv";
import { toast } from "sonner";

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export function DashboardPage() {
  const { products, categories, activityLog } = useAdminStore();

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const lowStock = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 3).length;
  const outOfStock = products.filter((p) => p.stockQuantity === 0).length;
  const featured = products.filter((p) => p.isFeatured).length;
  const newArrivals = products.filter((p) => p.isNewArrival).length;
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);

  // Bar chart — products per category
  const categoryData = categories.map((cat) => ({
    name: cat.name,
    count: products.filter((p) => p.category === cat.id).length,
  })).filter((d) => d.count > 0);

  // Pie chart — inventory status
  const inStock = products.filter((p) => p.stockQuantity > 3).length;
  const pieData = [
    { name: "In Stock", value: inStock },
    { name: "Low Stock", value: lowStock },
    { name: "Out of Stock", value: outOfStock },
  ];

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  function handleExport() {
    exportProductsCSV(products);
    toast.success("Products exported to CSV");
  }

  return (
    <div className="space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Welcome back — here's what's happening with your store.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-ivory hover:bg-espresso dark:bg-gold dark:text-charcoal"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <FolderOpen className="h-4 w-4" />
            Categories
          </Link>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <Upload className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Products" value={totalProducts} icon={BoxIcon} color="blue" />
        <StatCard label="Categories" value={totalCategories} icon={FolderOpen} color="purple" />
        <StatCard label="Low Stock" value={lowStock} icon={AlertTriangle} color="yellow" />
        <StatCard label="Out of Stock" value={outOfStock} icon={PackageX} color="red" />
        <StatCard label="Featured" value={featured} icon={Star} color="gold" />
        <StatCard label="New Arrivals" value={newArrivals} icon={Sparkles} color="green" />
        <StatCard
          label="Inventory Value"
          value={`KES ${inventoryValue.toLocaleString()}`}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard label="Active Products" value={products.filter((p) => p.isActive).length} icon={Package} color="green" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Products by Category
          </h2>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#c79a42" radius={[6, 6, 0, 0]} name="Products" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Inventory Status
          </h2>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent products + activity */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Recent products table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Recent Products
            </h2>
            <Link to="/admin/products" className="text-xs font-semibold text-gold hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800 dark:text-gray-500">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Price</th>
                  <th className="px-5 py-3 hidden md:table-cell">Stock</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 hidden lg:table-cell">Added</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="h-9 w-9 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-800 dark:text-gray-200">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell text-gray-700 dark:text-gray-300">
                      KES {p.price.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-gray-700 dark:text-gray-300">
                      {p.stockQuantity}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={getStockStatus(p.stockQuantity)} />
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-xs text-gray-400">
                      {format(new Date(p.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity log */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {activityLog.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400">No activity yet.</p>
            ) : (
              activityLog.slice(0, 8).map((entry) => (
                <div key={entry.id} className="px-5 py-3">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {entry.action}
                  </p>
                  <p className="text-xs text-gray-400">{entry.target}</p>
                  <p className="mt-0.5 text-[10px] text-gray-300 dark:text-gray-600">
                    {format(new Date(entry.timestamp), "MMM d, h:mm a")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
