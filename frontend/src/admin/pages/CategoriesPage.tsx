import { Check, FolderOpen, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useCategories, useAddCategory, useUpdateCategory, useDeleteCategory } from "../../hooks/useCategories";
import { useAdminProducts } from "../../hooks/useProducts";
import { useAdminStore } from "../store/admin-store";
import { ConfirmModal } from "../components/ConfirmModal";

export function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const { data: products = [] } = useAdminProducts();
  const { mutateAsync: addCat } = useAddCategory();
  const { mutateAsync: updateCat } = useUpdateCategory();
  const { mutateAsync: deleteCat } = useDeleteCategory();
  const { logActivity } = useAdminStore();

  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    try {
      await addCat({ name });
      logActivity("Created category", name);
      setNewName("");
      toast.success(`Category "${name}" created`);
    } catch { toast.error("Failed to create category"); }
    finally { setAdding(false); }
  }

  async function handleUpdate(id: string) {
    const name = editName.trim();
    if (!name) return;
    try {
      await updateCat({ id, name });
      logActivity("Updated category", name);
      setEditId(null);
      toast.success("Category updated");
    } catch { toast.error("Failed to update category"); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const name = categories.find((c) => c.id === deleteTarget)?.name ?? deleteTarget;
    try {
      await deleteCat(deleteTarget);
      logActivity("Deleted category", name);
      toast.success("Category deleted");
    } catch { toast.error("Failed to delete category"); }
    setDeleteTarget(null);
  }

  const targetCat = categories.find((c) => c.id === deleteTarget);
  const targetProductCount = products.filter((p) => p.category === deleteTarget).length;

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Manage your product categories. Data synced from Neon.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Add Category</h3>
        <div className="flex gap-2">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} className="input flex-1" placeholder="Category name (e.g. Sandals)" />
          <button onClick={handleAdd} disabled={adding || !newName.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-60">
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800 dark:text-gray-500">
                <th className="px-5 py-3">Category Name</th>
                <th className="px-5 py-3">Products</th>
                <th className="px-5 py-3 hidden sm:table-cell">Created</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-400">No categories yet.</td></tr>
              )}
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                return (
                  <tr key={cat.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                    <td className="px-5 py-3">
                      {editId === cat.id ? (
                        <div className="flex items-center gap-2">
                          <input value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)} className="input py-1 text-sm" autoFocus />
                          <button onClick={() => handleUpdate(cat.id)} className="rounded-full p-1 text-emerald-600 hover:bg-emerald-50"><Check className="h-4 w-4" /></button>
                          <button onClick={() => setEditId(null)} className="rounded-full p-1 text-gray-400 hover:bg-gray-100"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4 text-gold shrink-0" />
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{cat.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">{count}</span>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell text-xs text-gray-400">{format(new Date(cat.created_at), "MMM d, yyyy")}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700" title="Rename"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => setDeleteTarget(cat.id)} className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={`Delete "${targetCat?.name}"?`}
        description={targetProductCount > 0 ? `This category contains ${targetProductCount} product${targetProductCount > 1 ? "s" : ""}. Move or delete those products first.` : "This action cannot be undone."}
        confirmLabel={targetProductCount > 0 ? "Cannot Delete" : "Delete"}
        onConfirm={() => {
          if (targetProductCount > 0) { toast.error("Move or delete all products in this category first"); setDeleteTarget(null); }
          else handleDelete();
        }}
      />
    </div>
  );
}
