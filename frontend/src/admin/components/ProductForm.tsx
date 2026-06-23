import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useCategories } from "../../hooks/useCategories";
import { useAddProduct, useUpdateProduct } from "../../hooks/useProducts";
import { useAdminStore } from "../store/admin-store";
import type { AdminProduct } from "../types";
import { generateSlug } from "../types";

// ── Schema ─────────────────────────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  comparePrice: z.coerce.number().optional(),
  sku: z.string().min(1, "SKU is required"),
  stockQuantity: z.coerce.number().min(0, "Stock cannot be negative"),
  isNewArrival: z.boolean(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface ProductFormProps {
  product?: AdminProduct;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { data: categories = [] } = useCategories();
  const { mutateAsync: addProductDb } = useAddProduct();
  const { mutateAsync: updateProductDb } = useUpdateProduct();
  const { logActivity } = useAdminStore();
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [imageUrl, setImageUrl] = useState("");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(product);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      category: product?.category ?? "",
      price: product?.price ?? 0,
      comparePrice: product?.comparePrice,
      sku: product?.sku ?? "",
      stockQuantity: product?.stockQuantity ?? 0,
      isNewArrival: product?.isNewArrival ?? false,
      isFeatured: product?.isFeatured ?? false,
      isActive: product?.isActive ?? true,
    },
  });

  const nameValue = watch("name");
  useEffect(() => {
    if (!isEditing) {
      setSlug(generateSlug(nameValue ?? ""));
    }
  }, [nameValue, isEditing]);

  function addImageUrl() {
    const url = imageUrl.trim();
    if (!url) return;
    if (images.includes(url)) {
      toast.error("Image already added");
      return;
    }
    setImages((prev) => [...prev, url]);
    setImageUrl("");
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImages((prev) => [...prev, src]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function onSubmit(values: FormValues) {
    if (images.length === 0) {
      toast.error("Add at least one product image");
      return;
    }

    setSaving(true);
    setTimeout(async () => {
      try {
        if (isEditing && product) {
          await updateProductDb({ id: product.id, updates: { ...values, slug, images } });
          logActivity("Updated product", values.name);
          toast.success("Product updated");
        } else {
          const newProduct: AdminProduct = {
            id: crypto.randomUUID(),
            ...values,
            slug,
            images,
            comparePrice: values.comparePrice || undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await addProductDb(newProduct);
          logActivity("Created product", values.name);
          toast.success("Product created");
        }
        onSuccess?.();
      } catch {
        toast.error("Failed to save product");
      } finally {
        setSaving(false);
      }
    }, 0);
  }

  const Toggle = ({ name, label }: { name: keyof Pick<FormValues, "isNewArrival" | "isFeatured" | "isActive">; label: string }) => {
    const val = watch(name);
    return (
      <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={val}
          onClick={() => setValue(name, !val)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            val ? "bg-gold" : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              val ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </label>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic info */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Basic Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Product Name *</label>
            <input {...register("name")} className="input" placeholder="e.g. Women's Leather Handbag" />
            {errors.name && <p className="err">{errors.name.message}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="label">Slug (auto-generated)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="input font-mono text-xs"
              placeholder="womens-leather-handbag"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label">Description *</label>
            <textarea
              {...register("description")}
              rows={4}
              className="input resize-none"
              placeholder="Describe the product..."
            />
            {errors.description && <p className="err">{errors.description.message}</p>}
          </div>

          <div>
            <label className="label">Category *</label>
            <select {...register("category")} className="input">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="err">{errors.category.message}</p>}
          </div>

          <div>
            <label className="label">SKU *</label>
            <input {...register("sku")} className="input" placeholder="LH-BG-001" />
            {errors.sku && <p className="err">{errors.sku.message}</p>}
          </div>
        </div>
      </div>

      {/* Pricing & stock */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Pricing &amp; Stock
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Price (KES) *</label>
            <input type="number" {...register("price")} className="input" placeholder="7500" min={0} />
            {errors.price && <p className="err">{errors.price.message}</p>}
          </div>
          <div>
            <label className="label">Compare Price (KES)</label>
            <input type="number" {...register("comparePrice")} className="input" placeholder="9000" min={0} />
          </div>
          <div>
            <label className="label">Stock Quantity *</label>
            <input type="number" {...register("stockQuantity")} className="input" placeholder="10" min={0} />
            {errors.stockQuantity && <p className="err">{errors.stockQuantity.message}</p>}
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Images *
        </h3>

        {/* URL input */}
        <div className="flex gap-2">
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
            className="input flex-1"
            placeholder="Paste image URL and press Enter or click Add"
          />
          <button type="button" onClick={addImageUrl} className="btn-secondary shrink-0">
            Add URL
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary shrink-0 flex items-center gap-2"
          >
            <ImagePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Previews */}
        {images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {images.map((src, i) => (
              <div key={i} className="group relative">
                <img
                  src={src}
                  alt={`Product ${i + 1}`}
                  className="h-24 w-24 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 py-0.5 text-[9px] font-bold text-white">
                    MAIN
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Product Settings
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Toggle name="isFeatured" label="Featured Product" />
          <Toggle name="isNewArrival" label="New Arrival" />
          <Toggle name="isActive" label="Active (Visible)" />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-charcoal px-6 py-2.5 text-sm font-bold text-ivory transition hover:bg-espresso disabled:opacity-60 dark:bg-gold dark:text-charcoal"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? (isEditing ? "Updating..." : "Saving...") : isEditing ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
