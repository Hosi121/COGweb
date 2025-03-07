import { FC } from 'react';

export const ChatLoading: FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
        <style jsx>{`
          @keyframes pulseLoading {
            0%, 100% { transform: scale(0.75); opacity: 0.5; }
            50% { transform: scale(1); opacity: 1; }
          }
          .dot {
            animation: pulseLoading 1s infinite;
          }
          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }
        `}</style>
        <div className="w-2 h-2 bg-gradient-to-r from-orange-600 to-pink-600 rounded-full dot" />
        <div className="w-2 h-2 bg-gradient-to-r from-orange-600 to-pink-600 rounded-full dot" />
        <div className="w-2 h-2 bg-gradient-to-r from-orange-600 to-pink-600 rounded-full dot" />
      </div>
    </div>
  );
};
