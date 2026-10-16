/** KajKhoj theme: forest green (indigo slot), harvest amber (sky slot), warm neutrals (slate slot). */
module.exports = {
  darkMode: ["class"],
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"] },
      keyframes: {
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { "fade-in-down": "fade-in-down 0.5s ease-out" },
      boxShadow: { neon: "0 0 24px rgba(47,125,79,.45)" },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      colors: {
        indigo: { 50:"#f0f8f2",100:"#dcefe2",200:"#bcdfc8",300:"#8fc7a3",400:"#5ea97c",500:"#3d8d60",600:"#2f7d4f",700:"#26663f",800:"#1f5133",900:"#1a432c",950:"#0d2517" },
        sky:    { 50:"#fff8eb",100:"#feecc7",200:"#fdd88b",300:"#fcbf4d",400:"#f9a521",500:"#ee8a0d",600:"#d56b08",700:"#b04e0b",800:"#8f3d10",900:"#763311",950:"#451905" },
        slate:  { 50:"#f6f7f3",100:"#eceee6",200:"#dcdfd2",300:"#c3c8b6",400:"#9aa28b",500:"#7a8369",600:"#5f674f",700:"#4a5140",800:"#2a352d",900:"#1c261f",950:"#0e1612" },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
