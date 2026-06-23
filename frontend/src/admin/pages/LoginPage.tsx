import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "../store/auth-store";

const schema = z.object({
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Already logged in — redirect
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  function onSubmit({ password }: FormValues) {
    setLoading(true);
    login(password).then((ok) => {
      if (ok) {
        toast.success("Login successful. Welcome back!");
        navigate("/admin");
      } else {
        setError("password", { message: "Incorrect password. Please try again." });
        toast.error("Incorrect password");
      }
      setLoading(false);
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4 dark:bg-gray-950">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-charcoal dark:text-white">
            Laces &amp; Heels
          </h1>
          <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-gold">
            Admin Panel
          </p>
        </div>

        <div className="rounded-2xl border border-[#6f5545]/20 bg-white p-8 shadow-soft dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
            <Lock className="h-5 w-5 text-gold" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sign In</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter your admin password to continue.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter admin password"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-charcoal py-2.5 text-sm font-bold text-ivory transition hover:bg-espresso disabled:opacity-60 dark:bg-gold dark:text-charcoal dark:hover:bg-amber-500"
            >
              {loading ? "Logging In..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Laces &amp; Heels. All rights reserved.
        </p>
      </div>
    </div>
  );
}
