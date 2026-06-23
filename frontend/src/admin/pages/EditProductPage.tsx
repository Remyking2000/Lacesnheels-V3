import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ProductForm } from "../components/ProductForm";
import { useAdminStore } from "../store/admin-store";

export function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = useAdminStore((s) => s.products.find((p) => p.id === id));

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-xl text-gray-900 dark:text-white">Product not found.</p>
        <Link to="/admin/products" className="mt-4 inline-block text-sm text-gold hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/products"
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
            Edit Product
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{product.name}</p>
        </div>
      </div>
      <ProductForm product={product} onSuccess={() => navigate("/admin/products")} />
    </div>
  );
}
