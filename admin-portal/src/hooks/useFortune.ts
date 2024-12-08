import { useState, useEffect } from 'react';
import { Pen, Book, Briefcase, Umbrella } from 'lucide-react';
import { Fortune, FortuneItem, FortuneColor } from '@/types/fortune';

export const useFortune = () => {
    const [todaysFortune, setTodaysFortune] = useState<Fortune | null>(null);
    const [isAvailable, setIsAvailable] = useState(false);

  const lucks = ['大吉', '中吉', '小吉', '末吉'];
  
  const items: FortuneItem[] = [
    { name: 'ペン', icon: Pen },
    { name: '本', icon: Book },
    { name: 'カバン', icon: Briefcase },
    { name: '傘', icon: Umbrella },
  ];
  
  const colors: FortuneColor[] = [
    { name: '赤', hex: '#ef4444' },
    { name: '青', hex: '#3b82f6' },
    { name: '緑', hex: '#22c55e' },
    { name: '黄', hex: '#eab308' },
  ];
  
    // クライアントサイドでのみ実行
    useEffect(() => {
      const checkAvailability = () => {
        const now = new Date();
        const hours = now.getHours();
        setIsAvailable(hours >= 0 && hours < 24);
      };
  
      // 初回チェック
      checkAvailability();
  
      // 1分ごとにチェック
      const interval = setInterval(checkAvailability, 60000);
  
      // ローカルストレージからの復元も試みる
      const today = new Date().toISOString().split('T')[0];
      const stored = localStorage.getItem(`fortune_${today}`);
      if (stored) {
        try {
          const parsedFortune = JSON.parse(stored);
          // itemIconの再マッピング
          const matchedItem = items.find(item => item.name === parsedFortune.item);
          if (matchedItem) {
            parsedFortune.itemIcon = matchedItem.icon;
          }
          setTodaysFortune(parsedFortune);
        } catch (error) {
          console.error('Failed to parse stored fortune:', error);
        }
      }
  
      return () => clearInterval(interval);
    }, []);

  const generateFortune = (): Fortune | null => {
    if (!isAvailable) return null;

    // 日付をシードとして使用
    const today = new Date().toISOString().split('T')[0];
    const seed = Array.from(today).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const pseudoRandom = (max: number) => {
      const x = Math.sin(seed + max) * 10000;
      return Math.floor((x - Math.floor(x)) * max);
    };

    const luck = lucks[pseudoRandom(lucks.length)];
    const item = items[pseudoRandom(items.length)];
    const color = colors[pseudoRandom(colors.length)];

    return {
      luck,
      item: item.name,
      color: color.name,
      itemIcon: item.icon,
      colorHex: color.hex
    };
  };

  const getFortune = () => {
    // LocalStorageから今日の運勢を取得
    const today = new Date().toISOString().split('T')[0];
    const storageKey = `fortune_${today}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const parsedFortune = JSON.parse(stored);
        // itemIconはシリアライズできないため、再度マッピング
        const matchedItem = items.find(item => item.name === parsedFortune.item);
        if (matchedItem) {
          parsedFortune.itemIcon = matchedItem.icon;
        }
        setTodaysFortune(parsedFortune);
      } catch (error) {
        console.error('Failed to parse stored fortune:', error);
        localStorage.removeItem(storageKey);
      }
    } else if (isAvailable) {
      const fortune = generateFortune();
      if (fortune) {
        // itemIconを除外してストレージに保存
        const { itemIcon, ...fortuneForStorage } = fortune;
        localStorage.setItem(storageKey, JSON.stringify(fortuneForStorage));
        setTodaysFortune(fortune);
      }
    }
  };

  return {
    fortune: todaysFortune,
    isAvailable,
    getFortune
  };
};