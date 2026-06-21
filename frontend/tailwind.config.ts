import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: {
    relative: true,
    files: ["./index.html", "./src/**/*.{ts,tsx}"],
  },
  theme: {
    extend: {
      colors: {
        ivory: "#fbf5ea",
        cream: "#f7ead9",
        nude: "#ead9c5",
        blush: "#e9beb2",
        gold: "#c79a42",
        charcoal: "#302a25",
        espresso: "#241f1c",
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(73, 54, 39, 0.12)",
      },
    },
  },
  plugins: [animate, typography],
} satisfies Config;
