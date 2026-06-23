import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useSettings, useSaveSettings } from "../../hooks/useSettings";
import { useAdminStore } from "../store/admin-store";

const schema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeEmail: z.string().email("Invalid email address"),
  storePhone: z.string().min(1, "Phone is required"),
  storeAddress: z.string().min(1, "Address is required"),
  storeCurrency: z.string().min(1, "Currency is required"),
});

type FormValues = z.infer<typeof schema>;

export function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const { mutateAsync: saveSettings } = useSaveSettings();
  const { setSettings, logActivity } = useAdminStore();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: settings,
  });

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      await saveSettings(values);
      setSettings(values);
      logActivity("Updated settings", values.storeName);
      toast.success("Settings saved to database");
      reset(values);
    } catch { toast.error("Failed to save settings"); }
    finally { setSaving(false); }
  }

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Store settings are persisted in Neon PostgreSQL.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Store Information</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Store Name *</label>
              <input {...register("storeName")} className="input" />
              {errors.storeName && <p className="err">{errors.storeName.message}</p>}
            </div>
            <div>
              <label className="label">Store Email *</label>
              <input type="email" {...register("storeEmail")} className="input" />
              {errors.storeEmail && <p className="err">{errors.storeEmail.message}</p>}
            </div>
            <div>
              <label className="label">Phone *</label>
              <input {...register("storePhone")} className="input" placeholder="+254 100 663761" />
              {errors.storePhone && <p className="err">{errors.storePhone.message}</p>}
            </div>
            <div>
              <label className="label">Currency *</label>
              <input {...register("storeCurrency")} className="input" placeholder="KES" />
              {errors.storeCurrency && <p className="err">{errors.storeCurrency.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Store Address *</label>
              <input {...register("storeAddress")} className="input" placeholder="Nairobi, Kenya" />
              {errors.storeAddress && <p className="err">{errors.storeAddress.message}</p>}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Database</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Connected to <span className="font-semibold text-gray-700 dark:text-gray-300">Neon PostgreSQL</span>. All product, category, order, and settings data is persisted in the cloud database.
          </p>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving || !isDirty} className="flex items-center gap-2 rounded-lg bg-charcoal px-6 py-2.5 text-sm font-bold text-ivory transition hover:bg-espresso disabled:opacity-60 dark:bg-gold dark:text-charcoal">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
