'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, DiagnosticQuestion, AssessmentData } from '@/lib/api/client';
import { ArrowLeft, ArrowRight, Cloud, Loader2, Sparkles } from 'lucide-react';

export const DiagnosticQuestionnaire = () => {
  const router = useRouter();

  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize questions & active assessment state from backend
  const initDiagnostic = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Fetch questions for student's grade & class group
      const qRes = await apiClient.getDiagnosticQuestions();
      if (!qRes.success || !qRes.data?.questions) {
        throw new Error(qRes.message || 'Failed to load diagnostic questions.');
      }
      setQuestions(qRes.data.questions);

      // 2. Fetch active in-progress assessment (if any)
      const aRes = await apiClient.getActiveAssessment();
      let activeAssessment = aRes.data?.assessment;

      if (!activeAssessment) {
        // Start fresh assessment
        const startRes = await apiClient.startAssessment();
        activeAssessment = startRes.data?.assessment;
      }

      if (activeAssessment) {
        setAssessment(activeAssessment);
        setAnswers(activeAssessment.answers || {});
        setCurrentIndex(
          Math.min(activeAssessment.currentQuestionIndex || 0, qRes.data.questions.length - 1)
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error initializing diagnostic.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initDiagnostic();
  }, [initDiagnostic]);

  const currentQuestion = questions[currentIndex];

  // Auto-save function
  const autoSave = useCallback(async (idx: number, currentAnswers: Record<string, unknown>) => {
    setIsSaving(true);
    try {
      await apiClient.saveProgress(idx, currentAnswers);
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('Auto-save warning:', err);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Handle answer change with smart debouncing for text inputs
  const handleAnswerChange = (val: unknown, immediate: boolean = false) => {
    if (!currentQuestion) return;
    const updated = { ...answers, [currentQuestion.questionId]: val };
    setAnswers(updated);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (immediate) {
      autoSave(currentIndex, updated);
    } else {
      debounceTimeoutRef.current = setTimeout(() => {
        autoSave(currentIndex, updated);
      }, 1000);
    }
  };

  const handleNext = () => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      autoSave(nextIdx, answers);
    }
  };

  const handlePrev = () => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      autoSave(prevIdx, answers);
    }
  };

  const handleSubmit = async () => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await apiClient.submitAssessment(currentIndex, answers);
      if (res.success && res.data?.resultId) {
        router.push(`/diagnostic/results/${res.data.resultId}`);
      } else {
        throw new Error('Failed to retrieve evaluation report result ID.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit diagnostic.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-slate-400">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
        <p className="text-sm font-medium">Loading your grade-tailored diagnostic questions...</p>
      </div>
    );
  }

  if (error || !currentQuestion) {
    return (
      <div className="max-w-md mx-auto p-6 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-center space-y-4">
        <p className="text-sm font-semibold text-rose-300">{error || 'No questions available.'}</p>
        <button
          onClick={initDiagnostic}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const progressPercentage = Math.round(((currentIndex + 1) / questions.length) * 100);
  const currentAnswerVal = answers[currentQuestion.questionId];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Top Header & Cloud Sync State */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400">
            {currentQuestion.section}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
              <span>Saving progress...</span>
            </>
          ) : (
            <>
              <Cloud className="w-4 h-4 text-emerald-400" />
              <span>Saved {lastSavedTime ? `at ${lastSavedTime}` : 'to Cloud'}</span>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar & Section Overview */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-slate-300">
          <span className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentQuestion.section}
            </span>
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
          </span>
          <span className="text-sky-400 font-extrabold">{progressPercentage}% Complete</span>
        </div>
        
        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Quick Question Dot Matrix Navigator */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {questions.map((q, qIdx) => {
            const isCurrent = qIdx === currentIndex;
            const isAnswered = answers[q.questionId] !== undefined && answers[q.questionId] !== '';
            return (
              <button
                key={q.questionId}
                onClick={() => {
                  if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
                  setCurrentIndex(qIdx);
                  autoSave(qIdx, answers);
                }}
                title={`Q${qIdx + 1}: ${q.questionText}`}
                className={`w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-sky-500 text-slate-950 ring-2 ring-sky-400 shadow-md scale-110'
                    : isAnswered
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900'
                    : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
                }`}
              >
                {qIdx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-100 leading-snug">
            {currentQuestion.questionText}
          </h2>
          {currentQuestion.helperText && (
            <p className="text-xs text-slate-400 leading-relaxed italic">
              &quot;{currentQuestion.helperText}&quot;
            </p>
          )}
        </div>

        {/* INPUT TYPE: Single Choice */}
        {currentQuestion.questionType === 'single_choice' && (
          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQuestion.options?.map((opt) => {
              const isSelected = currentAnswerVal === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => handleAnswerChange(opt.value, true)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-950/40 border-sky-500 text-sky-200 shadow-md ring-1 ring-sky-500/30'
                      : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-sm font-medium">{opt.label}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-sky-500 bg-sky-500 text-slate-950' : 'border-slate-700'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-slate-950"></span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* INPUT TYPE: Multiple Choice */}
        {currentQuestion.questionType === 'multiple_choice' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {currentQuestion.options?.map((opt) => {
              const currentArr = Array.isArray(currentAnswerVal) ? (currentAnswerVal as string[]) : [];
              const isSelected = currentArr.includes(opt.value);

              const toggleMultiple = () => {
                let updated: string[];
                if (isSelected) {
                  updated = currentArr.filter((v) => v !== opt.value);
                } else {
                  updated = [...currentArr, opt.value];
                }
                handleAnswerChange(updated, true);
              };

              return (
                <div
                  key={opt.value}
                  onClick={toggleMultiple}
                  className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-950/40 border-sky-500 text-sky-200 shadow-md'
                      : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-xs font-semibold">{opt.label}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                      isSelected ? 'border-sky-500 bg-sky-500 text-slate-950 font-bold' : 'border-slate-700'
                    }`}
                  >
                    {isSelected && '✓'}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* INPUT TYPE: Free Text */}
        {currentQuestion.questionType === 'text' && (
          <div className="pt-2">
            <textarea
              rows={4}
              value={String(currentAnswerVal || '')}
              onChange={(e) => handleAnswerChange(e.target.value, false)}
              placeholder="Type your answer here in your own words..."
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600 leading-relaxed"
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating AI Report...
                </>
              ) : (
                <>
                  Submit & View Diagnostic Report
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
