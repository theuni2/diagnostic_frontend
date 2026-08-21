'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, BookOpen, GraduationCap, ShieldAlert } from 'lucide-react';

type ClassGroupType = '6-8' | '9-10' | '11-12';

export const OnboardingWizard = () => {
  const router = useRouter();
  const { user, profile, updateProfile } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 State
  const [grade, setGrade] = useState<number>(profile?.grade || 9);
  const [schoolBoard, setSchoolBoard] = useState<string>(profile?.schoolBoard || 'CBSE');
  const [country, setCountry] = useState<string>(profile?.country || 'India');

  // Step 2 State
  const [stream, setStream] = useState<string>(profile?.stream || 'Science with Maths');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    profile?.subjects && profile.subjects.length > 0
      ? profile.subjects
      : ['Mathematics', 'Physics', 'Chemistry', 'English']
  );
  const [customSubject, setCustomSubject] = useState<string>('');
  const [academicPerformance, setAcademicPerformance] = useState<string>(
    profile?.academicPerformance || '85% overall, strong in Maths & Science'
  );

  const availableSubjectOptions = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Economics',
    'Accountancy',
    'Business Studies',
    'Psychology',
    'History',
    'Political Science',
    'English Literature',
  ];

  const handleToggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleAddCustomSubject = () => {
    if (customSubject.trim() && !selectedSubjects.includes(customSubject.trim())) {
      setSelectedSubjects([...selectedSubjects, customSubject.trim()]);
      setCustomSubject('');
    }
  };

  const calculateClassGroup = (selectedGrade: number): ClassGroupType => {
    if (selectedGrade <= 8) return '6-8';
    if (selectedGrade <= 10) return '9-10';
    return '11-12';
  };

  const handleCompleteOnboarding = async () => {
    setIsSubmitting(true);
    setError(null);

    const classGroup = calculateClassGroup(grade);

    try {
      await updateProfile({
        grade,
        classGroup,
        schoolBoard,
        country,
        stream,
        subjects: selectedSubjects,
        academicPerformance,
        onboardingCompleted: true,
      });

      router.push('/diagnostic');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8">
      {/* Top Stepper Indicator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span className="text-sky-400">Step {step} of 3</span>
          <span>{step === 1 ? 'Basic Info' : step === 2 ? 'Academic Profile' : 'Diagnostic Ready'}</span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Basic Information */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Let&apos;s get to know you</h2>
            <p className="text-xs text-slate-400">
              Tell us your grade and curriculum so we can personalize your diagnostic experience.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Your Grade
              </label>
              <div className="grid grid-cols-7 gap-2">
                {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                      grade === g
                        ? 'bg-sky-600 border-sky-500 text-white shadow-lg shadow-sky-600/20'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-sky-400 mt-2 font-medium">
                Assigned Class Group: <strong>Group {calculateClassGroup(grade)}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  School Board / Curriculum
                </label>
                <select
                  value={schoolBoard}
                  onChange={(e) => setSchoolBoard(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-all"
                >
                  <option value="CBSE">CBSE (Central Board)</option>
                  <option value="ICSE">ICSE / ISC</option>
                  <option value="IB">IB (International Baccalaureate)</option>
                  <option value="Cambridge">Cambridge (IGCSE / A-Levels)</option>
                  <option value="State Board">State Board</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. India, UAE, Singapore"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              Continue to Academics
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Academic Focus & Subjects */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Tell us about your academics</h2>
            <p className="text-xs text-slate-400">
              Select your current stream, subjects, and general academic performance.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Stream or Academic Focus
              </label>
              <input
                type="text"
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                placeholder="e.g. Science PCM, Commerce with Accounts, IB HL Maths & Econ"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Current Subjects
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {availableSubjectOptions.map((subj) => {
                  const isSelected = selectedSubjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => handleToggleSubject(subj)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {subj}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Add custom subject..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSubject}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Performance / Predicted Scores (Optional)
              </label>
              <input
                type="text"
                value={academicPerformance}
                onChange={(e) => setAcademicPerformance(e.target.value)}
                placeholder="e.g. 85% overall, predicted 36 IB, SAT 1350 (Approximate is fine)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              Review & Finalize
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Ready Confirmation */}
      {step === 3 && (
        <div className="space-y-6 text-center animate-fadeIn">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-sky-500/20">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-100">Ready to Discover Your Direction!</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Your profile is set for <strong>Grade {grade} (Class Group {calculateClassGroup(grade)})</strong> under <strong>{schoolBoard}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Student Name:</span>
              <span className="font-semibold text-slate-200">{user?.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Grade & Group:</span>
              <span className="font-semibold text-sky-400">Grade {grade} (Group {calculateClassGroup(grade)})</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Stream & Subjects:</span>
              <span className="font-semibold text-slate-200">{selectedSubjects.slice(0, 4).join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location & Board:</span>
              <span className="font-semibold text-slate-200">{schoolBoard}, {country}</span>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Edit Profile
            </button>

            <button
              type="button"
              onClick={handleCompleteOnboarding}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Starting Diagnostic...' : 'Start Diagnostic Now'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
