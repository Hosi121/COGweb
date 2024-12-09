import { ChatInterface } from '@/components/chat/ChatInterface';
import { Header } from '@/components/layout/Header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
      <ChatInterface />
    </div>
  );
}