'use client';
import { useState, useEffect } from 'react';
import { useFortune } from '@/hooks/useFortune';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles } from 'lucide-react';

export default function FortunePage() {
    const { fortune, isAvailable, getFortune } = useFortune();
    const [mounted, setMounted] = useState(false);
  
    // クライアントサイドでマウント完了後にのみレンダリング
    useEffect(() => {
      setMounted(true);
    }, []);
  
    if (!mounted) {
      return (
        <main className="container mx-auto px-6 py-8">
          <Card className="max-w-md mx-auto border-none shadow-xl bg-white/70 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex justify-center items-center min-h-[200px]">
                <span className="text-slate-500">Loading...</span>
              </div>
            </CardContent>
          </Card>
        </main>
      );
    }

  return (
    <main className="container mx-auto px-6 py-8">
      <Card className="max-w-md mx-auto border-none shadow-xl bg-white/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Sparkles className="h-5 w-5 text-orange-600" />
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
              今日の運勢
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isAvailable ? (
            <p className="text-center text-slate-600">
              占いは朝6時から7時の間のみ利用できます。
            </p>
          ) : !fortune ? (
            <Button
              onClick={getFortune}
              className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700"
            >
              運勢を占う
            </Button>
          ) : (
            <div className="space-y-4 text-center">
              <div className="text-3xl font-bold text-orange-600">
                {fortune.luck}
              </div>
              <div className="space-y-2">
                <p className="flex items-center justify-center gap-2">
                  <span className="text-slate-600">ラッキーアイテム：</span>
                  <span className="font-medium">{fortune.item}</span>
                  {fortune.itemIcon && <fortune.itemIcon className="h-5 w-5" />}
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="text-slate-600">ラッキーカラー：</span>
                  <span className="font-medium">{fortune.color}</span>
                  <span 
                    className="inline-block w-5 h-5 rounded-full" 
                    style={{ backgroundColor: fortune.colorHex }}
                  />
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}