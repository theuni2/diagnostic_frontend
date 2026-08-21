'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import { checkBackendHealth } from '@/lib/api/client';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Compass,
  Award,
  GraduationCap,
  Brain,
  Zap,
  Target,
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleCheckBackend = async () => {
    setStatus('loading');
    setResponseMessage(null);
    try {
      const data = await checkBackendHealth();
      if (data && data.success) {
        setStatus('connected');
        setResponseMessage(data.message);
      } else {
        setStatus('error');
        setResponseMessage('Unexpected response format');
      }
    } catch (err) {
      console.error('Failed to connect to backend:', err);
      setStatus('error');
      setResponseMessage(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 space-y-20">
        {/* HERO SECTION */}
        <section className="relative text-center space-y-8 max-w-4xl mx-auto pt-6">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold tracking-wide shadow-lg shadow-sky-500/5">
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>AI-POWERED DIAGNOSTIC ENGINE FOR CLASSES 6–12</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-100">
            Discover Your True{' '}
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Academic Potential & Direction
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Uncover your natural strengths, genuine interests, learning habits, and ideal career/university path with our grade-tailored diagnostic platform.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {user ? (
              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                Go to Student Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                >
                  Start Diagnostic Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-sm transition-all hover:border-slate-700"
                >
                  Student Login
                </Link>
              </>
            )}
          </div>
        </section>

        {/* GRADE-BASED TIERS HIGHLIGHT */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4 hover:border-sky-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Group 6–8</span>
              <h3 className="text-xl font-bold text-slate-100">Middle School Exploration</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Focuses on genuine curiosity, learning behavior, activity preferences, and building excitement around discovery without heavy career pressure.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4 hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Group 9–10</span>
              <h3 className="text-xl font-bold text-slate-100">High School Orientation</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluates natural strengths vs effort areas, stream selection (Science / Commerce / Humanities), and domain exploration before major board choices.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4 hover:border-purple-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Group 11–12</span>
              <h3 className="text-xl font-bold text-slate-100">College & Career Direction</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated module matching target degrees, universities, profile strengths vs gaps, and actionable application prep steps.
            </p>
          </div>
        </section>

        {/* CORE PLATFORM FEATURES */}
        <section className="p-10 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Built For Genuine Student Clarity
            </h2>
            <p className="text-xs text-slate-400">
              Not a generic test. A structured diagnostic that understands who you are academically.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-sm">1</div>
              <h4 className="font-bold text-sm text-slate-200">Onboarding Setup</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Quick 3-step setup capturing grade, board, subjects, and country.</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-sm">2</div>
              <h4 className="font-bold text-sm text-slate-200">Grade Branching</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Configurable questions adapted strictly to your grade level.</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-sm">3</div>
              <h4 className="font-bold text-sm text-slate-200">Cloud Auto-Save</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Answers save in real time. Refresh or resume anytime on any device.</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-sm">4</div>
              <h4 className="font-bold text-sm text-slate-200">Personalized Report</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Structured AI report detailing strengths, interests, and next steps.</p>
            </div>
          </div>
        </section>

        {/* SYSTEM STATUS WIDGET */}
        <section className="max-w-md mx-auto p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Backend REST API Verification
          </div>

          <div>
            <button
              onClick={handleCheckBackend}
              disabled={status === 'loading'}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              {status === 'loading' ? 'Verifying...' : 'Check API Status (/api/health)'}
            </button>
          </div>

          {status === 'connected' && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-semibold text-xs animate-fadeIn flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Backend Connected ({responseMessage})
            </div>
          )}

          {status === 'error' && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 font-semibold text-xs animate-fadeIn">
              Backend Not Available ({responseMessage})
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>© 2026 UD Diagnostic AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
