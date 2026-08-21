import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Navbar } from '@/components/ui/Navbar';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <Suspense fallback={<div className="text-sm text-slate-400">Loading token...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </main>
    </div>
  );
}
