'use client';

import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Bell, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
    id: string;
    title: string;
    date: string;
    type: 'event' | 'law' | 'news';
    description: string;
    createdAt: string; // ISO形式の日時
   }
   
   const MOCK_EVENTS: Event[] = [
    { 
      id: '1', 
      title: '市民祭り', 
      date: '2024-12-30', 
      type: 'event',
      description: '年次市民祭り開催',
      createdAt: '2024-12-05T10:00:00Z'
    },
    { 
      id: '2', 
      title: '道路交通法改正', 
      date: '2024-12-20', 
      type: 'law',
      description: '自転車関連の改正施行',
      createdAt: '2024-12-04T15:30:00Z'
    },
    {
      id: '3',
      title: '市役所窓口時間延長のお知らせ',
      date: '2024-12-10',
      type: 'news',
      description: '12月中の木曜日は19時まで延長営業いたします',
      createdAt: '2024-12-06T09:00:00Z'
    }
   ];

   type SortType = 'date' | 'created';
   
   export const EventList: FC = () => {
     const [sortType, setSortType] = useState<SortType>('date');
   
     const calculateDaysUntil = (dateString: string) => {
       const eventDate = new Date(dateString);
       const today = new Date();
       return Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
     };
   
     const sortedEvents = [...MOCK_EVENTS].sort((a, b) => {
       if (sortType === 'date') {
         return calculateDaysUntil(a.date) - calculateDaysUntil(b.date);
       }
       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
     });
   
     return (
       <Card className="border-none shadow-xl bg-white/70 backdrop-blur">
         <CardHeader>
           <div className="flex justify-between items-center">
             <CardTitle className="flex items-center gap-3 text-xl">
               <Bell className="h-5 w-5 text-orange-600" />
               <span className="bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">
                 お知らせ
               </span>
             </CardTitle>
             <button
               onClick={() => setSortType(prev => prev === 'date' ? 'created' : 'date')}
               className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
             >
               <ArrowUpDown className="h-4 w-4" />
               <span className="text-sm font-medium">
                 {sortType === 'date' ? '残り日数が少ない順' : '新着順'}
               </span>
             </button>
           </div>
         </CardHeader>
         <CardContent>
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr className="border-b border-slate-200">
                   <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">種類</th>
                   <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">タイトル</th>
                   <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">予定日</th>
                   <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">残り日数</th>
                   <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">投稿日</th>
                 </tr>
               </thead>
               <tbody>
                 {sortedEvents.map((event) => {
                   const daysUntil = calculateDaysUntil(event.date);
                   const isUpcoming = daysUntil >= 0;
                   return (
                     <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                       <td className="px-4 py-3">
                         <span className={`
                           px-2 py-1 rounded-full text-xs font-medium
                           ${event.type === 'event' ? 'bg-blue-100 text-blue-700' : ''}
                           ${event.type === 'law' ? 'bg-purple-100 text-purple-700' : ''}
                           ${event.type === 'news' ? 'bg-green-100 text-green-700' : ''}
                         `}>
                           {event.type === 'event' && 'イベント'}
                           {event.type === 'law' && '法改正'}
                           {event.type === 'news' && 'お知らせ'}
                         </span>
                       </td>
                       <td className="px-4 py-3">
                         <div>
                           <div className="font-medium text-slate-900">{event.title}</div>
                           <div className="text-sm text-slate-500">{event.description}</div>
                         </div>
                       </td>
                       <td className="px-4 py-3 text-slate-900">{event.date}</td>
                       <td className="px-4 py-3">
                         {isUpcoming ? (
                           <span className="text-orange-600 font-medium">
                             あと{daysUntil}日
                           </span>
                         ) : (
                           <span className="text-slate-500">終了</span>
                         )}
                       </td>
                       <td className="px-4 py-3 text-sm text-slate-500">
                         {format(new Date(event.createdAt), 'yyyy/MM/dd HH:mm')}
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
         </CardContent>
       </Card>
     );
   };