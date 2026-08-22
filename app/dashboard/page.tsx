'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import { ClassGroupSelector } from '@/components/diagnostic/ClassGroupSelector';
import { apiClient, AssessmentData, DiagnosticResultData } from '@/lib/api/client';
import {
  User as UserIcon,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  GraduationCap,
  Play,
  RotateCcw,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();

  console.log('[DashboardPage] Render step 1: Component evaluated', {
    user,
    profile,
    isLoading,
  });

  const [activeAssessment, setActiveAssessment] = useState<AssessmentData | null>(null);
  const [results, setResults] = useState<DiagnosticResultData[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(true);

  console.log('[DashboardPage] Render step 2: State snapshot', {
    hasActiveAssessment: !!activeAssessment,
    resultsCount: results.length,
    loadingDashboard,
  });

  const fetchDashboardData = useCallback(async () => {
    console.log('[DashboardPage] fetchDashboardData step 1: Triggered', { userId: user?.id, email: user?.email });
    if (!user) {
      console.log('[DashboardPage] fetchDashboardData step 2: No user logged in, skipping API calls');
      return;
    }
    try {
      console.log('[DashboardPage] fetchDashboardData step 3: Setting loadingDashboard to true');
      setLoadingDashboard(true);
      console.log('[DashboardPage] fetchDashboardData step 4: Fetching active assessment & diagnostic results...');
      const [aRes, rRes] = await Promise.all([
        apiClient.getActiveAssessment(),
        apiClient.getDiagnosticResults(),
      ]);
      console.log('[DashboardPage] fetchDashboardData step 5: API responses received', { aRes, rRes });

      if (aRes.success && aRes.data?.assessment) {
        console.log('[DashboardPage] fetchDashboardData step 6: Active assessment found', aRes.data.assessment);
        setActiveAssessment(aRes.data.assessment);
      } else {
        console.log('[DashboardPage] fetchDashboardData step 6: No active assessment found');
        setActiveAssessment(null);
      }

      if (rRes.success && rRes.data?.results) {
        console.log('[DashboardPage] fetchDashboardData step 7: Diagnostic results found (count:', rRes.data.results.length, ')');
        setResults(rRes.data.results);
      } else {
        console.log('[DashboardPage] fetchDashboardData step 7: No diagnostic results returned');
      }
    } catch (err) {
      console.error('[DashboardPage] fetchDashboardData error:', err);
      if (err instanceof Error && (err.message.includes('authorized') || err.message.includes('401'))) {
        console.log('[DashboardPage] fetchDashboardData: Unauthorized (401), redirecting to /login');
        router.push('/login');
        return;
      }
      console.warn('Dashboard data fetch warning:', err);
    } finally {
      console.log('[DashboardPage] fetchDashboardData finally: Setting loadingDashboard to false');
      setLoadingDashboard(false);
    }
  }, [user, router]);

  useEffect(() => {
    console.log('[DashboardPage] useEffect triggered', { isLoading, hasUser: !!user });
    if (!isLoading && !user) {
      console.log('[DashboardPage] useEffect: Auth state ready & no user -> Redirecting to /login');
      router.push('/login');
    } else if (user) {
      console.log('[DashboardPage] useEffect: Auth state ready & user exists -> Calling fetchDashboardData');
      fetchDashboardData();
    }
  }, [isLoading, user, router, fetchDashboardData]);

  if (isLoading || loadingDashboard) {
    console.log('[DashboardPage] Render step 3: Displaying Loading Dashboard screen', { isLoading, loadingDashboard });
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-sm">
        Loading student dashboard...
      </div>
    );
  }

  if (!user) {
    console.log('[DashboardPage] Render step 3: No user found, returning null');
    return null;
  }

  console.log('[DashboardPage] Render step 3: Displaying Main Dashboard View for user:', user.email);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-8 py-10">
        {/* Welcome Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Student Diagnostic Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
              Welcome back, {user.name}!
            </h1>
            <p className="text-sm text-slate-400">
              {profile?.onboardingCompleted
                ? `Grade ${profile.grade || ''} • ${profile.schoolBoard || ''} • Class Group ${profile.classGroup || ''}`
                : 'Complete your onboarding profile to unlock grade-tailored diagnostics.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!profile?.onboardingCompleted ? (
              <Link
                href="/onboarding"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-xl flex items-center gap-2 transition-all"
              >
                Complete Onboarding
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Onboarding Complete</span>
              </div>
            )}
          </div>
        </div>

        {/* Diagnostic Action Card */}
        <section className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Diagnostic Engine
              </div>
              <h2 className="text-2xl font-bold text-slate-100">
                {activeAssessment
                  ? 'Diagnostic Assessment in Progress'
                  : 'Ready to Discover Your Path?'}
              </h2>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                {activeAssessment
                  ? `You have an active diagnostic saved at question ${activeAssessment.currentQuestionIndex + 1}. Resume anytime.`
                  : 'Take our grade-tailored diagnostic to uncover your academic strengths, natural interests, and college/career direction.'}
              </p>
            </div>

            <div>
              {activeAssessment ? (
                <Link
                  href="/diagnostic"
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/20 flex items-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Resume Diagnostic (Q{activeAssessment.currentQuestionIndex + 1})
                </Link>
              ) : (
                <Link
                  href="/diagnostic"
                  className="px-7 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-xl shadow-sky-600/20 flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Start New Diagnostic
                </Link>
              )}
            </div>
          </div>

          {activeAssessment && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-sky-400" />
                <span className="text-slate-300">
                  Last auto-saved:{' '}
                  <strong>{new Date(activeAssessment.lastSavedAt).toLocaleTimeString()}</strong>
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 font-semibold">
                In Progress
              </span>
            </div>
          )}
        </section>

        {/* Diagnostic Results History Section */}
        {results.length > 0 && (
          <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-sky-400" />
              Your Diagnostic Reports
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((res) => (
                <Link
                  key={res._id}
                  href={`/diagnostic/results/${res._id}`}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between space-y-3 group cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-400 font-semibold text-[11px] border border-sky-800/50">
                        Class Group {res.classGroup}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(res.generatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-100 group-hover:text-sky-300 transition-colors text-base">
                      Grade {res.grade} Evaluation Report
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      Interests: {res.evaluation?.genuineInterests?.join(', ') || 'N/A'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
                    View Full Report
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Class Group Selector Component */}
        <section className="space-y-4">
          <ClassGroupSelector currentGroup={profile?.classGroup} />
        </section>

        {/* Student Profile Summary */}
        <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-sky-400" />
            Student Profile Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Full Name</span>
              <p className="font-semibold text-slate-200 text-sm">{user.name}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Email Address</span>
              <p className="font-semibold text-slate-200 text-sm truncate">{user.email}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Grade & Group</span>
              <p className="font-semibold text-slate-200 text-sm">
                {profile?.grade ? `Grade ${profile.grade} (${profile.classGroup})` : 'Not Set'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">School Board</span>
              <p className="font-semibold text-sky-400 text-sm">{profile?.schoolBoard || 'Not Set'}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
