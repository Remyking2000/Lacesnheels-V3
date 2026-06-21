import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export function NotFoundPage() {
  return (
    <main className="section">
      <div className="section-inner rounded-lg border border-[#6f5545]/20 bg-white p-12 text-center">
        <p className="eyebrow">404</p>
        <h1 className="font-display text-5xl">Page not found</h1>
        <p className="mx-auto mt-3 max-w-xl text-[#8c7768]">The page you opened is not part of the current storefront.</p>
        <Button asChild className="mt-6"><Link to="/">Back home</Link></Button>
      </div>
    </main>
  );
}
