import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { ShopPage } from "./pages/ShopPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Admin
import { AdminLayout } from "./admin/components/AdminLayout";
import { ProtectedRoute } from "./admin/components/ProtectedRoute";
import { LoginPage } from "./admin/pages/LoginPage";
import { DashboardPage } from "./admin/pages/DashboardPage";
import { ProductsPage } from "./admin/pages/ProductsPage";
import { NewProductPage } from "./admin/pages/NewProductPage";
import { EditProductPage } from "./admin/pages/EditProductPage";
import { CategoriesPage } from "./admin/pages/CategoriesPage";
import { OrdersPage } from "./admin/pages/OrdersPage";
import { SettingsPage } from "./admin/pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      {/* ── Storefront ── */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:slug" element={<ProductPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* ── Admin login (public) ── */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* ── Admin panel (protected) ── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<NewProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
