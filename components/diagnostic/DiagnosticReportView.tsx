'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { apiClient, DiagnosticResultData } from '@/lib/api/client';
import { Grade68ReportView } from './Grade68ReportView';
import {
  Sparkles,
  Compass,
  Award,
  Target,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface DiagnosticReportViewProps {
  resultId: string;
}

export const DiagnosticReportView: React.FC<DiagnosticReportViewProps> = ({ resultId }) => {
  const [result, setResult] = useState<DiagnosticResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResult = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.getDiagnosticResultById(resultId);
      if (res.success && res.data?.result) {
        setResult(res.data.result);
      } else {
        throw new Error(res.message || 'Diagnostic report not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading report');
    } finally {
      setIsLoading(false);
    }
  }, [resultId]);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-slate-400">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-sm font-medium">Fetching your diagnostic evaluation report...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto p-6 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        <p className="text-sm font-semibold text-rose-300">{error || 'Report not found.'}</p>
        <Link
          href="/dashboard"
          className="inline-block px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { evaluation, classGroup, grade } = result;

  // Extract raw submitted assessment answers if populated
  const rawAnswers = typeof result.assessmentId === 'object' ? result.assessmentId?.answers : undefined;

  // Render Grade 6-8 Discovery Report View if classGroup is 6-8 or grade68DiscoveryReport exists
  if ((classGroup === '6-8' || grade <= 8) && evaluation.grade68DiscoveryReport) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>
        <Grade68ReportView data={evaluation.grade68DiscoveryReport} rawAnswers={rawAnswers} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/50 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Diagnostic Evaluation Report
          </div>
          <span className="text-xs text-slate-400">
            Generated {new Date(result.generatedAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100">
          Diagnostic Report for {evaluation.studentName || 'Student'}
        </h1>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium">
            Grade {grade}
          </span>
          <span className="px-3 py-1 rounded-lg bg-sky-950 text-sky-300 font-semibold border border-sky-800/50">
            Class Group {classGroup}
          </span>
        </div>
      </div>

      {/* SECTION 1: Natural Academic Strengths & Effort */}
      <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-sky-400" />
          Academic Profile & Strengths
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
              Natural Strengths
            </h3>
            <ul className="space-y-1 text-xs text-slate-200">
              {evaluation.academicStrengths?.map((str, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-sky-400">✓</span> {str}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Curiosity & Problem Solving Style
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {evaluation.curiosityPattern}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Genuine Interests & Activity Preferences */}
      <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-sky-400" />
          Genuine Interests & Preferred Activities
        </h2>

        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Topics of Natural Curiosity
            </h3>
            <div className="flex flex-wrap gap-2">
              {evaluation.genuineInterests?.map((int, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-sky-950/40 border border-sky-800/50 text-sky-300 text-xs font-medium"
                >
                  {int}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Enjoyed Activity Styles
            </h3>
            <div className="flex flex-wrap gap-2">
              {evaluation.activityPreferences?.map((act, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs"
                >
                  {act}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Career Exploration & Domain Curiosity */}
      <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-sky-400" />
          Career Exploration & Domain Curiosity
        </h2>
        <div className="flex flex-wrap gap-2">
          {evaluation.careerCuriosity?.map((car, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-800/50 text-indigo-300 text-xs font-medium"
            >
              {car}
            </span>
          ))}
        </div>
      </section>

      {/* SECTION 4: GRADE 11–12 DEDICATED COLLEGE & DEGREE DIRECTION */}
      {classGroup === '11-12' && evaluation.collegeGuidance && (
        <section className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-900/50 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-indigo-300 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            College & University Target Guidance (Grades 11–12)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Intended Degree Path</span>
              <p className="font-bold text-sky-300 text-sm">{evaluation.collegeGuidance.degreeDirection}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Target Institutions</span>
              <p className="font-bold text-slate-200 text-sm">
                {evaluation.collegeGuidance.targetUniversities?.join(', ')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="font-semibold text-emerald-400 uppercase tracking-wider">
                Profile Strengths
              </h3>
              <ul className="space-y-1 text-slate-300">
                {evaluation.collegeGuidance.profileStrengths?.map((ps, idx) => (
                  <li key={idx}>• {ps}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="font-semibold text-amber-400 uppercase tracking-wider">
                Profile Areas to Strengthen
              </h3>
              <ul className="space-y-1 text-slate-300">
                {evaluation.collegeGuidance.profileGaps?.map((pg, idx) => (
                  <li key={idx}>• {pg}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: Recommended Actionable Next Steps */}
      <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-sky-400" />
          Recommended Next Steps
        </h2>
        <div className="space-y-2">
          {evaluation.recommendedNextSteps?.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-sky-500/10 text-sky-400 font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Action Footer */}
      <div className="pt-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Student Dashboard
        </Link>
      </div>
    </div>
  );
};
