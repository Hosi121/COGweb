import Link from 'next/link';

export const Header = () => (
  <header className="backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-slate-200">
    <nav className="container mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
          市民情報ポータル
        </Link>
        <Link 
          href="/statistics" 
          className="px-4 py-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all"
        >
          統計情報
        </Link>
      </div>
    </nav>
  </header>
);