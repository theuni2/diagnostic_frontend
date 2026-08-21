'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

interface ClassGroupSelectorProps {
  currentGroup?: '6-8' | '9-10' | '11-12';
  onSaved?: () => void;
}

export const ClassGroupSelector: React.FC<ClassGroupSelectorProps> = ({
  currentGroup,
  onSaved,
}) => {
  const { updateProfile } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<'6-8' | '9-10' | '11-12' | undefined>(
    currentGroup
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const options: { group: '6-8' | '9-10' | '11-12'; label: string; desc: string }[] = [
    { group: '6-8', label: 'Classes 6 – 8', desc: 'Middle School (Foundation & Exploration)' },
    { group: '9-10', label: 'Classes 9 – 10', desc: 'High School (Academic Orientation & Skills)' },
    { group: '11-12', label: 'Classes 11 – 12', desc: 'Senior Secondary (Stream & Career Readiness)' },
  ];

  const handleSave = async () => {
    if (!selectedGroup) {
      setErrorMessage('Please select a class group to continue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await updateProfile({ classGroup: selectedGroup });
      setSuccessMessage(`Class group set to '${selectedGroup}' successfully!`);
      if (onSaved) onSaved();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update class group');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">
          Select Your Class Group
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Class group selection is required before accessing diagnostics and personalized assessments.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => {
          const isSelected = selectedGroup === opt.group;
          return (
            <div
              key={opt.group}
              onClick={() => setSelectedGroup(opt.group)}
              className={`cursor-pointer p-5 rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-950/40 border-sky-500 shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/20'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-400">
                    Group {opt.group}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500 text-slate-950'
                        : 'border-slate-700'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-slate-950"></span>}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-100">{opt.label}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{opt.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSubmitting || !selectedGroup}
          className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 disabled:opacity-50 text-white font-semibold text-sm shadow-lg transition-all cursor-pointer"
        >
          {isSubmitting ? 'Saving Selection...' : 'Confirm Class Group'}
        </button>
      </div>
    </div>
  );
};
