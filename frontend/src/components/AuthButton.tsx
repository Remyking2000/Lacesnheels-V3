import { useGoogleLogin } from "@react-oauth/google";
import { LogOut, User } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { useUserStore } from "../store/user-store";
import { Button } from "./ui/button";

export function AuthButton() {
  const { user, signInWithGoogle, signOut, isLoading } = useUserStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // Exchange access token for user info, then send to our backend
      try {
        const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((r) => r.json()) as {
          sub: string; email: string; name: string; picture: string;
        };

        // Sign in via backend with user info directly (no ID token needed for implicit flow)
        const { api } = await import("../lib/api");
        const profile = await api.post<{
          id: string; email: string; name: string; avatar: string;
        }>("/api/auth/google/callback", {
          googleId: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          avatar: userInfo.picture,
        });

        useUserStore.getState().signInWithGoogle("");
        // Manually set user since we went through callback
        useUserStore.setState({ user: profile, isLoading: false });
        toast.success(`Welcome, ${profile.name.split(" ")[0]}! 👋`);
      } catch {
        toast.error("Sign in failed. Please try again.");
      }
    },
    onError: () => toast.error("Google sign in was cancelled."),
  });

  function handleSignOut() {
    signOut();
    setDropdownOpen(false);
    toast.success("Signed out successfully");
  }

  // ── Signed in — show avatar + dropdown ────────────────────────────────────
  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          aria-label="Account menu"
          aria-expanded={dropdownOpen}
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-gold/40 transition-all hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-gold text-xs font-black text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-[#6f5545]/20 bg-white shadow-soft dark:bg-gray-900">
            {/* User info */}
            <div className="flex items-center gap-3 border-b border-[#6f5545]/10 px-4 py-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-charcoal dark:text-white">
                  {user.name}
                </p>
                <p className="truncate text-xs text-[#8c7768]">{user.email}</p>
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-[#6f5545] transition-colors hover:bg-cream hover:text-charcoal dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Signed out — show sign in button ──────────────────────────────────────
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Sign in with Google"
      onClick={() => login()}
      disabled={isLoading}
      title="Sign in"
      className="relative"
    >
      <User className="h-5 w-5" />
    </Button>
  );
}
