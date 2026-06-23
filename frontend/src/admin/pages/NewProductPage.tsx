import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ProductForm } from "../components/ProductForm";

export function NewProductPage() {
  const navigate = useNavigate();
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
            Add New Product
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Fill in the details below to create a new product listing.
          </p>
        </div>
      </div>
      <ProductForm onSuccess={() => navigate("/admin/products")} />
    </div>
  );
}
