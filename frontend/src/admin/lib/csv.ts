import type { AdminProduct } from "../types";

export function exportProductsCSV(products: AdminProduct[]) {
  const headers = [
    "ID", "Name", "Slug", "Category", "Price", "Compare Price",
    "SKU", "Stock", "Featured", "New Arrival", "Active", "Created At",
  ];

  const rows = products.map((p) => [
    p.id, p.name, p.slug, p.category, p.price, p.comparePrice ?? "",
    p.sku, p.stockQuantity, p.isFeatured, p.isNewArrival, p.isActive, p.createdAt,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `laces-heels-products-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function parseProductsCSV(file: File): Promise<Partial<AdminProduct>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter(Boolean);
        const [headerLine, ...dataLines] = lines;
        const headers = headerLine.split(",").map((h) => h.replace(/"/g, "").trim().toLowerCase());

        const products = dataLines.map((line) => {
          const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) ?? [];
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => {
            obj[h] = (values[i] ?? "").replace(/^"|"$/g, "").trim();
          });

          return {
            name: obj.name ?? "",
            slug: obj.slug ?? "",
            category: obj.category ?? "",
            price: parseFloat(obj.price ?? "0") || 0,
            comparePrice: obj["compare price"] ? parseFloat(obj["compare price"]) : undefined,
            sku: obj.sku ?? "",
            stockQuantity: parseInt(obj.stock ?? "0") || 0,
            isFeatured: obj.featured?.toLowerCase() === "true",
            isNewArrival: obj["new arrival"]?.toLowerCase() === "true",
            isActive: obj.active?.toLowerCase() !== "false",
          } satisfies Partial<AdminProduct>;
        });

        resolve(products);
      } catch {
        reject(new Error("Failed to parse CSV file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
