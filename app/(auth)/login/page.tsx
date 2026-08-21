import { LoginForm } from '@/components/auth/LoginForm';
import { Navbar } from '@/components/ui/Navbar';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <LoginForm />
      </main>
    </div>
  );
}
