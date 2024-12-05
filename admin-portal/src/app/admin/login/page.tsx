'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      if (formData.get('id') === process.env.NEXT_PUBLIC_ADMIN_USER && 
          formData.get('password') === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        document.cookie = 'adminToken=valid; path=/';
        router.push('/admin');
      } else {
        setError('認証に失敗しました');
      }
    };
    
    return (
        <main className="container mx-auto px-6 py-8">
            <Card className="max-w-md mx-auto border-none shadow-xl bg-white/70 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-xl bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
                        管理者ログイン
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-red-600 bg-red-50 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">ID</label>
                            <input
                                name="id"
                                type="text"
                                className="mt-1 w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">パスワード</label>
                            <input
                                name="password"
                                type="password"
                                className="mt-1 w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full p-3 rounded-xl bg-gradient-to-r from-orange-600 to-pink-600 text-white hover:shadow-lg"
                        >
                            ログイン
                        </button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}