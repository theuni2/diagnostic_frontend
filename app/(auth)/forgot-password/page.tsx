import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Navbar } from '@/components/ui/Navbar';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <ForgotPasswordForm />
      </main>
    </div>
  );
}
