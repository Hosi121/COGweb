import { LoginForm } from '@/components/admin/LoginForm';
import { CsvUploader } from '@/components/admin/CsvUploader';

export default function AdminPage() {
  return (
    <main className="container mx-auto px-6 py-8">
      <div className="space-y-8">
        <LoginForm />
        <CsvUploader />
      </div>
    </main>
  );
}