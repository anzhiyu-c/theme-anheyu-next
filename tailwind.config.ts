import type { Config } from "tailwindcss";

const { heroui } = require("@heroui/react");
const typography = require("@tailwindcss/typography");

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  // 确保 prose 类始终被包含
  safelist: [
    "prose",
    "prose-lg",
    "prose-invert",
    "dark:prose-invert",
    { pattern: /^prose-/ },
  ],
  theme: {
    extend: {
      colors: {
        // 基础颜色 - 使用 CSS 变量（anheyu-pro 配色）
        background: "var(--anzhiyu-background)",
        foreground: "var(--anzhiyu-fontcolor)",

        // 卡片
        card: {
          DEFAULT: "var(--anzhiyu-card-bg)",
          foreground: "var(--anzhiyu-fontcolor)",
        },

        // 主色调（主题色）
        primary: {
          DEFAULT: "var(--anzhiyu-theme)",
          foreground: "#ffffff",
          50: "var(--anzhiyu-theme-op-light)",
          100: "var(--anzhiyu-theme-op)",
          500: "var(--anzhiyu-theme)",
          600: "var(--anzhiyu-theme-op-deep)",
        },

        // 次要色
        secondary: {
          DEFAULT: "var(--anzhiyu-secondbg)",
          foreground: "var(--anzhiyu-secondtext)",
        },

        // 静音色
        muted: {
          DEFAULT: "var(--anzhiyu-gray-op)",
          foreground: "var(--anzhiyu-gray)",
        },

        // 强调色
        accent: {
          DEFAULT: "var(--anzhiyu-main)",
          foreground: "#ffffff",
        },

        // 边框
        border: "var(--anzhiyu-card-border)",
        input: "var(--anzhiyu-card-border)",
        ring: "var(--anzhiyu-theme)",

        // 功能色
        destructive: {
          DEFAULT: "var(--anzhiyu-red)",
          foreground: "#ffffff",
        },
        success: "var(--anzhiyu-green)",
        warning: "var(--anzhiyu-yellow)",
        info: "var(--anzhiyu-blue)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "glow-pulse": "glow-pulse 8s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(60px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.15)", opacity: "0.7" },
        },
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "8px",
      },
      boxShadow: {
        card: "var(--anzhiyu-shadow-border)",
        "card-hover": "var(--anzhiyu-shadow-main)",
        nav: "var(--anzhiyu-shadow-nav)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    typography,
    heroui({
      themes: {
        light: {
          colors: {
            // anheyu-pro 亮色主题（蓝色）
            primary: {
              DEFAULT: "#163bf2",
              foreground: "#ffffff",
              50: "#eef2ff",
              100: "#e0e7ff",
              200: "#c7d2fe",
              300: "#a5b4fc",
              400: "#818cf8",
              500: "#163bf2",
              600: "#1232d9",
              700: "#0e27b3",
              800: "#0b1f8c",
              900: "#081766",
            },
            focus: "#163bf2",
          },
        },
        dark: {
          colors: {
            // anheyu-pro 暗色主题（金色）
            primary: {
              DEFAULT: "#dfa621",
              foreground: "#000000",
              50: "#fef9e7",
              100: "#fdf3cf",
              200: "#fbe79f",
              300: "#f9db6f",
              400: "#f7cf3f",
              500: "#dfa621",
              600: "#b8871a",
              700: "#916814",
              800: "#6a4a0d",
              900: "#432b07",
            },
            focus: "#dfa621",
          },
        },
      },
    }),
  ],
};

export default config;
