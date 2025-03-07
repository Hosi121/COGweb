// src/app/main/layout.tsx
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Header } from "@/components/layout/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Header />

      {/* スキップナビゲーションのターゲット */}
      <a id="main-content" className="sr-only">
        メインコンテンツ
      </a>

      <main className="flex-grow focus:outline-none">{children}</main>

      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6 mt-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; 2025 市民情報ポータル All Rights Reserved.
          </p>
        </div>
      </footer>

      <ChatInterface />
    </div>
  );
}
