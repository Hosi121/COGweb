"use client";
import { FC } from 'react';
import Link from 'next/link';
import { Home, Sparkles, BarChart, Camera, Image } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const Header: FC = () => {
  const pathname = usePathname();

  // パスから現在のページを判定する関数
  const isCurrentPage = (path: string) => {
    if (path === '/main') {
      return pathname === '/main';
    }
    // fortune と statistics は完全一致で判定
    return pathname === path;
  };
  
  return (
    <header className="bg-gradient-to-b from-white to-orange-50 border-b border-orange-100">
      <div className="container mx-auto px-4 pt-4 pb-2">
        <Link 
          href="/main" 
          className="inline-block text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text"
        >
          市民情報ポータル
        </Link>
      </div>

      <nav className="container mx-auto px-4 pb-2">
        <ul className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1 sm:gap-2">
          {[
            { href: '/main', label: 'ホーム', icon: Home },
            { href: '/main/fortune', label: '今日の運勢', icon: Sparkles },
            { href: '/main/statistics', label: '統計情報', icon: BarChart },
            { href: '/main/upload', label: '写真投稿', icon: Camera },
            { href: '/main/photos', label: 'ギャラリー', icon: Image},
          ].map(({ href, label, icon: Icon }) => (
            <li key={href} className="w-full sm:w-auto">
              <Link
                href={href}
                className={`
                  flex items-center justify-center sm:justify-start gap-1 sm:gap-2 
                  px-2 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl
                  text-sm sm:text-base
                  transition-all duration-200 
                  ${isCurrentPage(href) 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                    : 'text-slate-600 hover:bg-orange-100'
                  }
                `}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};