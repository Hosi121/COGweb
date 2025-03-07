"use client";

import { useState, useEffect } from "react";

type ColorMode = "light" | "dark" | "system";
type FontSize = "small" | "normal" | "large";

export function useThemeSettings() {
  const [colorMode, setColorMode] = useState<ColorMode>("system");
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [mounted, setMounted] = useState(false);

  // マウント時に保存された設定を読み込む
  useEffect(() => {
    // ダークモード設定を読み込む
    const savedColorMode = localStorage.getItem(
      "colorMode"
    ) as ColorMode | null;
    if (savedColorMode) {
      setColorMode(savedColorMode);
    }

    // フォントサイズ設定を読み込む
    const savedFontSize = localStorage.getItem("fontSize") as FontSize | null;
    if (savedFontSize) {
      setFontSize(savedFontSize);
      document.documentElement.setAttribute("data-font-size", savedFontSize);
    }

    // システム設定の確認とダークモード適用
    applyColorMode(savedColorMode || "system");

    setMounted(true);
  }, []);

  // カラーモードの適用
  const applyColorMode = (mode: ColorMode) => {
    if (mode === "system") {
      // システム設定に従う
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);

      // システム設定の変更を監視
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle("dark", e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // 手動設定を適用
      document.documentElement.classList.toggle("dark", mode === "dark");
    }
  };

  // カラーモード切り替え
  const toggleColorMode = (mode: ColorMode) => {
    setColorMode(mode);
    localStorage.setItem("colorMode", mode);
    applyColorMode(mode);
  };

  // フォントサイズ変更
  const changeFontSize = (size: FontSize) => {
    setFontSize(size);
    document.documentElement.setAttribute("data-font-size", size);
    localStorage.setItem("fontSize", size);
  };

  return {
    colorMode,
    fontSize,
    toggleColorMode,
    changeFontSize,
    mounted,
  };
}
