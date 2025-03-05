"use client";
import { FC, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Sparkles,
  BarChart,
  Camera,
  Image,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  ChevronRight,
} from "lucide-react";
import { useThemeSettings } from "@/hooks/useThemeSettings";
import { Button } from "@/components/ui/Button";

// アクセシビリティ用のスキップリンクコンポーネント
const SkipLink: FC = () => (
  <a
    href="#main-content"
    className="absolute z-50 left-4 -translate-y-16 focus:translate-y-4 bg-orange-600 text-white px-4 py-2 rounded font-medium transition-transform"
  >
    メインコンテンツにスキップ
  </a>
);

// フォントサイズ設定コンポーネント
const FontSizeSelector: FC<{
  currentSize: string;
  onChange: (size: "small" | "normal" | "large") => void;
}> = ({ currentSize, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
        文字サイズ
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onChange("small")}
          className={`px-3 py-2 rounded-lg flex gap-1 items-center ${
            currentSize === "small"
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium"
              : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          }`}
          aria-pressed={currentSize === "small"}
        >
          <span className="text-sm">小さい</span>
        </button>
        <button
          onClick={() => onChange("normal")}
          className={`px-3 py-2 rounded-lg flex gap-1 items-center ${
            currentSize === "normal"
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium"
              : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          }`}
          aria-pressed={currentSize === "normal"}
        >
          <span className="text-sm">標準</span>
        </button>
        <button
          onClick={() => onChange("large")}
          className={`px-3 py-2 rounded-lg flex gap-1 items-center ${
            currentSize === "large"
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium"
              : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          }`}
          aria-pressed={currentSize === "large"}
        >
          <span className="text-sm">大きい</span>
        </button>
      </div>
    </div>
  );
};

// カラーモード設定コンポーネント
const ColorModeSelector: FC<{
  currentMode: string;
  onChange: (mode: "light" | "dark" | "system") => void;
}> = ({ currentMode, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
        表示モード
      </span>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => onChange("light")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            currentMode === "light"
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          aria-pressed={currentMode === "light"}
        >
          <Sun className="w-4 h-4" aria-hidden="true" />
          <span>ライトモード</span>
        </button>

        <button
          onClick={() => onChange("dark")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            currentMode === "dark"
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          aria-pressed={currentMode === "dark"}
        >
          <Moon className="w-4 h-4" aria-hidden="true" />
          <span>ダークモード</span>
        </button>

        <button
          onClick={() => onChange("system")}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            currentMode === "system"
              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          aria-pressed={currentMode === "system"}
        >
          <Monitor className="w-4 h-4" aria-hidden="true" />
          <span>システム設定に合わせる</span>
        </button>
      </div>
    </div>
  );
};

// メインのヘッダーコンポーネント
export const Header: FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { colorMode, fontSize, toggleColorMode, changeFontSize, mounted } =
    useThemeSettings();

  // 設定ダイアログを閉じる
  const closeSettingsDialog = () => {
    document.getElementById("settings-dialog")?.classList.add("hidden");
  };

  // パスから現在のページを判定する関数
  const isCurrentPage = (path: string) => {
    if (path === "/main") {
      return pathname === "/main";
    }
    return pathname === path;
  };

  const navItems = [
    { href: "/main", label: "ホーム", icon: Home },
    { href: "/main/fortune", label: "今日の運勢", icon: Sparkles },
    { href: "/main/statistics", label: "統計情報", icon: BarChart },
    { href: "/main/upload", label: "写真投稿", icon: Camera },
    { href: "/main/photos", label: "ギャラリー", icon: Image },
    { href: "/main/presentations", label: "発表資料", icon: Sparkles },
  ];

  // SSRとCSRの違いによる表示のちらつきを防止
  if (!mounted) {
    return (
      <header className="bg-white border-b border-orange-100 relative">
        <div className="container mx-auto px-4 pt-4 pb-2">
          <div className="flex justify-between items-center">
            <span className="inline-block text-xl sm:text-2xl font-bold">
              市民情報ポータル
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-orange-100 dark:border-slate-700 relative">
      <SkipLink />

      {/* 設定ダイアログ */}
      <div
        id="settings-dialog"
        className="hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={(e) => {
          // ダイアログの外側をクリックした場合に閉じる
          if (e.target === e.currentTarget) {
            closeSettingsDialog();
          }
        }}
      >
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 p-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              表示設定
            </h2>
            <button
              onClick={closeSettingsDialog}
              className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-full"
              aria-label="閉じる"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-6">
            {/* 文字サイズ設定 */}
            <div className="space-y-3">
              <h3 className="text-base font-medium text-slate-800 dark:text-slate-200">
                文字サイズ
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => changeFontSize("small")}
                  className={`py-3 px-4 rounded-lg flex items-center justify-center ${
                    fontSize === "small"
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium"
                      : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                  aria-pressed={fontSize === "small"}
                >
                  小さい
                </button>
                <button
                  onClick={() => changeFontSize("normal")}
                  className={`py-3 px-4 rounded-lg flex items-center justify-center ${
                    fontSize === "normal"
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium"
                      : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                  aria-pressed={fontSize === "normal"}
                >
                  標準
                </button>
                <button
                  onClick={() => changeFontSize("large")}
                  className={`py-3 px-4 rounded-lg flex items-center justify-center ${
                    fontSize === "large"
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium"
                      : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                  aria-pressed={fontSize === "large"}
                >
                  大きい
                </button>
              </div>
            </div>

            {/* 表示モード設定 */}
            <div className="space-y-3">
              <h3 className="text-base font-medium text-slate-800 dark:text-slate-200">
                表示モード
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => toggleColorMode("light")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    colorMode === "light"
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium"
                      : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                  aria-pressed={colorMode === "light"}
                >
                  <Sun className="w-5 h-5" aria-hidden="true" />
                  <span>ライトモード (明るい背景)</span>
                </button>

                <button
                  onClick={() => toggleColorMode("dark")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    colorMode === "dark"
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium"
                      : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                  aria-pressed={colorMode === "dark"}
                >
                  <Moon className="w-5 h-5" aria-hidden="true" />
                  <span>ダークモード (暗い背景)</span>
                </button>

                <button
                  onClick={() => toggleColorMode("system")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    colorMode === "system"
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium"
                      : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                  aria-pressed={colorMode === "system"}
                >
                  <Monitor className="w-5 h-5" aria-hidden="true" />
                  <span>システム設定に合わせる</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="default"
                onClick={closeSettingsDialog}
                className="w-full py-2 px-4"
              >
                設定を閉じる
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-4 pb-2">
        <div className="flex justify-between items-center">
          <Link
            href="/main"
            className="inline-block text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
            aria-label="市民情報ポータル ホームへ"
          >
            市民情報ポータル
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center gap-2 p-2 px-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <>
                  <X className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm font-medium">閉じる</span>
                </>
              ) : (
                <>
                  <Menu className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm font-medium">メニュー</span>
                </>
              )}
            </button>

            <Button
              variant="default"
              size="sm"
              onClick={() => {
                document
                  .getElementById("settings-dialog")
                  ?.classList.remove("hidden");
              }}
              className="flex items-center gap-2"
            >
              <span>表示設定</span>
            </Button>
          </div>
        </div>
      </div>

      {/* デスクトップナビゲーション */}
      <nav
        className="container mx-auto px-4 pb-2 hidden md:block"
        aria-label="メインナビゲーション"
      >
        <ul className="flex flex-wrap gap-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <li key={href} className="w-auto">
              <Link
                href={href}
                className={`
                  flex items-center justify-start gap-2 
                  px-6 py-3 rounded-xl
                  text-base
                  transition-all duration-200 
                  focus:outline-none focus:ring-2 focus:ring-orange-500
                  ${
                    isCurrentPage(href)
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-orange-100 dark:hover:bg-slate-700"
                  }
                `}
                aria-current={isCurrentPage(href) ? "page" : undefined}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* モバイルナビゲーション */}
      {isMobileMenuOpen && (
        <div>
          <nav
            id="mobile-menu"
            className="md:hidden absolute w-full bg-white dark:bg-slate-800 z-50 border-t border-orange-100 dark:border-slate-700 shadow-lg"
            aria-label="モバイルナビゲーション"
          >
            <ul className="py-2">
              {navItems.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`
                      flex items-center justify-between
                      px-6 py-4 border-b border-slate-100 dark:border-slate-700
                      ${
                        isCurrentPage(href)
                          ? "text-orange-600 bg-orange-50 dark:bg-slate-700/50 dark:text-orange-400"
                          : "text-slate-800 dark:text-slate-200"
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isCurrentPage(href) ? "page" : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      <span className="font-medium">{label}</span>
                    </div>
                    <ChevronRight
                      className="w-4 h-4 text-slate-400"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
              <Button
                variant="default"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document
                    .getElementById("settings-dialog")
                    ?.classList.remove("hidden");
                }}
                className="w-full flex items-center justify-center gap-2 py-3"
              >
                表示設定を開く
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
