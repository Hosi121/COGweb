import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // ダークモードの設定を「class」に変更して手動で制御できるようにする
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // 文字サイズ変更のためのユーティリティクラス
      fontSize: {
        // 既存のサイズはそのまま
        'size-small': 'var(--font-size-small)',
        'size-normal': 'var(--font-size-normal)',
        'size-large': 'var(--font-size-large)',
      },
    },
  },
  plugins: [],
} satisfies Config;