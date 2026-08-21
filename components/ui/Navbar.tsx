'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon, GraduationCap, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, profile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              UD Diagnostic AI
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase -mt-1">
              Classes 6–12
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>{user.name}</span>
                {profile?.classGroup && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-bold text-[10px] border border-sky-500/20">
                    Group {profile.classGroup}
                  </span>
                )}
              </Link>

              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-800/50 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-bold px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
