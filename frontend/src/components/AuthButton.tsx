import { useGoogleLogin } from "@react-oauth/google";
import { LogOut, User } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { useUserStore } from "../store/user-store";
import { api } from "../lib/api";
import { Button } from "./ui/button";

export function AuthButton() {
  const { user, signOut, isLoading } = useUserStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Google OAuth popup — implicit/access-token flow
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      useUserStore.setState({ isLoading: true });
      try {
        // 1. Fetch user info from Google
        const googleUser = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((r) => r.json()) as {
          sub: string;
          email: string;
          name: string;
          picture: string;
        };

        // 2. Send to our backend → upsert in DB
        const profile = await api.post<{
          id: string;
          email: string;
          name: string;
          avatar: string;
        }>("/api/auth/google/callback", {
          googleId: googleUser.sub,
          email:    googleUser.email,
          name:     googleUser.name,
          avatar:   googleUser.picture,
        });

        // 3. Persist in Zustand store
        useUserStore.setState({ user: profile, isLoading: false });
        toast.success(`Welcome, ${profile.name.split(" ")[0]}! 👋`);
      } catch {
        useUserStore.setState({ isLoading: false });
        toast.error("Sign in failed. Please try again.");
      }
    },
    onError: () => {
      useUserStore.setState({ isLoading: false });
      toast.error("Google sign in was cancelled.");
    },
  });

  function handleSignOut() {
    signOut();
    setDropdownOpen(false);
    toast.success("Signed out successfully");
  }

  // ── Signed in ─────────────────────────────────────────────────────────────
  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        {/* Avatar button */}
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          aria-label="Account menu"
          aria-expanded={dropdownOpen}
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-[#6f5545]/30 transition-all hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-gold text-xs font-black text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-xl border border-[#6f5545]/20 bg-white shadow-soft">
            {/* User info row */}
            <div className="flex items-center gap-3 border-b border-[#6f5545]/10 px-4 py-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-charcoal">{user.name}</p>
                <p className="truncate text-xs text-[#8c7768]">{user.email}</p>
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-[#6f5545] transition-colors hover:bg-cream hover:text-charcoal"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Signed out ────────────────────────────────────────────────────────────
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Sign in with Google"
      title="Sign in with Google"
      onClick={() => login()}
      disabled={isLoading}
    >
      {isLoading ? (
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <User className="h-5 w-5" />
      )}
    </Button>
  );
}
