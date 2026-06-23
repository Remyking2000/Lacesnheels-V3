import {
  Copy,
  Download,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAdminStore } from "../store/admin-store";
import { StatusBadge } from "../components/StatusBadge";
import { ConfirmModal } from "../components/ConfirmModal";
import { getStockStatus } from "../types";
import { exportProductsCSV, parseProductsCSV } from "../lib/csv";
import type { AdminProduct } from "../types";

const PAGE_SIZE = 10;

export function ProductsPage() {
  const { products, categories, deleteProduct, updateProduct, addProduct } = useAdminStore();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [bulkConfirm, setBulkConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered list
  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) ||
      categories.find((c) => c.id === p.category)?.name.toLowerCase().includes(q);
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    const status = getStockStatus(p.stockQuantity);
    const matchStock =
      stockFilter === "all" ||
      (stockFilter === "in" && status === "In Stock") ||
      (stockFilter === "low" && status === "Low Stock") ||
      (stockFilter === "out" && status === "Out of Stock");
    const matchFeatured =
      featuredFilter === "all" ||
      (featuredFilter === "featured" && p.isFeatured) ||
      (featuredFilter === "new" && p.isNewArrival);
    return matchSearch && matchCat && matchStock && matchFeatured;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((p) => p.id)));
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setTimeout(() => {
      deleteProduct(deleteTarget);
      setDeleteTarget(null);
      setDeleting(false);
      toast.success("Product deleted");
    }, 500);
  }

  function handleBulkAction(action: string) {
    const ids = Array.from(selected);
    if (action === "delete") {
      ids.forEach((id) => deleteProduct(id));
      toast.success(`${ids.length} products deleted`);
    } else if (action === "featured") {
      ids.forEach((id) => updateProduct(id, { isFeatured: true }));
      toast.success(`${ids.length} products marked as featured`);
    } else if (action === "new-arrival") {
      ids.forEach((id) => updateProduct(id, { isNewArrival: true }));
      toast.success(`${ids.length} products marked as new arrival`);
    } else if (action === "deactivate") {
      ids.forEach((id) => updateProduct(id, { isActive: false }));
      toast.success(`${ids.length} products deactivated`);
    }
    setSelected(new Set());
    setBulkConfirm(null);
  }

  function handleDuplicate(p: AdminProduct) {
    const clone: AdminProduct = {
      ...p,
      id: crypto.randomUUID(),
      name: `${p.name} (Copy)`,
      slug: `${p.slug}-copy-${Date.now()}`,
      sku: `${p.sku}-COPY`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addProduct(clone);
    toast.success(`"${p.name}" duplicated`);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const rows = await parseProductsCSV(file);
      rows.forEach((row) => {
        if (!row.name) return;
        const newProduct: AdminProduct = {
          id: crypto.randomUUID(),
          name: row.name ?? "",
          slug: row.slug ?? row.name?.toLowerCase().replace(/\s+/g, "-") ?? "",
          description: "",
          category: row.category ?? "",
          price: row.price ?? 0,
          comparePrice: row.comparePrice,
          images: [],
          stockQuantity: row.stockQuantity ?? 0,
          sku: row.sku ?? "",
          isNewArrival: row.isNewArrival ?? false,
          isFeatured: row.isFeatured ?? false,
          isActive: row.isActive ?? true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addProduct(newProduct);
      });
      toast.success(`${rows.length} products imported`);
    } catch {
      toast.error("Failed to import CSV");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-5 min-w-0">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="btn-secondary flex items-center gap-2"
          >
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Import CSV
          </button>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
          <button
            onClick={() => { exportProductsCSV(products); toast.success("Exported"); }}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <Link to="/admin/products/new" className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input pl-9"
            placeholder="Search name, SKU, category..."
          />
        </div>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="input w-auto">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setPage(1); }} className="input w-auto">
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <select value={featuredFilter} onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1); }} className="input w-auto">
          <option value="all">All Products</option>
          <option value="featured">Featured</option>
          <option value="new">New Arrivals</option>
        </select>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gold/30 bg-amber-50 px-4 py-2 dark:bg-amber-900/10">
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            {selected.size} selected
          </span>
          <button onClick={() => handleBulkAction("featured")} className="btn-xs">Mark Featured</button>
          <button onClick={() => handleBulkAction("new-arrival")} className="btn-xs">Mark New Arrival</button>
          <button onClick={() => handleBulkAction("deactivate")} className="btn-xs">Deactivate</button>
          <button
            onClick={() => setBulkConfirm("delete")}
            className="btn-xs bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400"
          >
            Delete Selected
          </button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-gray-400 hover:text-gray-600">
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {paginated.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-xl text-gray-900 dark:text-white">No products found.</p>
            <p className="mt-2 text-sm text-gray-400">
              {search || categoryFilter !== "all" || stockFilter !== "all"
                ? "Try adjusting your filters."
                : "Create your first product to get started."}
            </p>
            {!search && categoryFilter === "all" && stockFilter === "all" && (
              <Link to="/admin/products/new" className="btn-primary mt-4 inline-flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800 dark:text-gray-500">
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.size === paginated.length && paginated.length > 0}
                      onChange={toggleAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3 hidden sm:table-cell">SKU</th>
                  <th className="px-4 py-3 hidden md:table-cell">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Flags</th>
                  <th className="px-4 py-3 hidden xl:table-cell">Added</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => {
                  const cat = categories.find((c) => c.id === p.category);
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 ${
                        selected.has(p.id) ? "bg-amber-50 dark:bg-amber-900/10" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(p.id)}
                          onChange={() => toggleSelect(p.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <img
                            src={p.images[0] ?? "https://via.placeholder.com/40"}
                            alt={p.name}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                          />
                          <span className="min-w-0 truncate font-semibold text-gray-800 dark:text-gray-200 max-w-[160px]">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell font-mono text-xs text-gray-500">
                        {p.sku}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-600 dark:text-gray-400">
                        {cat?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">
                        KES {p.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-gray-600 dark:text-gray-400">
                        {p.stockQuantity}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={getStockStatus(p.stockQuantity)} />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex gap-1">
                          {p.isFeatured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                              <Star className="h-2.5 w-2.5" /> Featured
                            </span>
                          )}
                          {p.isNewArrival && (
                            <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-xs text-gray-400">
                        {format(new Date(p.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/admin/products/edit/${p.id}`}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </Link>
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p.id)}
                            className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-gray-800">
            <p className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-3 py-1 text-xs disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary px-3 py-1 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete single */}
      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Product?"
        description="This action cannot be undone. The product will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
      />

      {/* Bulk delete confirm */}
      <ConfirmModal
        open={bulkConfirm === "delete"}
        onOpenChange={(o) => !o && setBulkConfirm(null)}
        title={`Delete ${selected.size} Products?`}
        description="This action cannot be undone."
        confirmLabel="Delete All"
        onConfirm={() => handleBulkAction("delete")}
      />
    </div>
  );
}
