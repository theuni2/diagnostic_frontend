'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grade68ReportPayload } from '@/lib/api/client';
import {
  Sparkles,
  Compass,
  Target,
  GraduationCap,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Grade68ReportViewProps {
  data?: Grade68ReportPayload;
  rawAnswers?: Record<string, string | string[]>;
}

export const Grade68ReportView: React.FC<Grade68ReportViewProps> = ({ data, rawAnswers }) => {
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const safeData = data || ({} as Partial<Grade68ReportPayload>);

  const {
    studentName = 'Student',
    grade = 'Grade 8',
    assessmentDate = 'June 2026',
    streamLeaning = 'Arts',
    whoIsStudent,
    aptitudeAnalysis,
    careerInterestProfile,
    motivatorsAndValues,
    personalityAndWorkingStyle,
    careerClusters,
    careerRecommendations,
    streamAndSubjectRecommendation,
    profileRoadmap,
    summaryAndNextSteps,
  } = safeData;

  const displayName = studentName || 'Student';
  const aptitudeScore = aptitudeAnalysis?.overallScore || 75;
  const riasecScore = 92;
  const fitScore = careerRecommendations?.paths?.[0]?.fitScore || 88;

  // SVG Circumference calculation: 2 * PI * r (r = 38 => ~238.76)
  const strokeCircumference = 238.76;
  const aptitudeOffset = strokeCircumference - (strokeCircumference * aptitudeScore) / 100;
  const riasecOffset = strokeCircumference - (strokeCircumference * riasecScore) / 100;
  const fitOffset = strokeCircumference - (strokeCircumference * fitScore) / 100;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 animate-fadeIn text-slate-100 font-sans pb-12">
      {/* TOP DASHBOARD HERO CARD */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src="/images/avatar.jpg"
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-400 p-0.5 shadow-xl shadow-indigo-500/30 group-hover:scale-105 transition-all"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  {displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold">
                  {grade}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Career & Profile Discovery Report | Uni Discovery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-medium text-slate-300">
              <span className="text-slate-400">Date:</span> {assessmentDate || 'August 2026'}
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center gap-1.5">
              <span>Stream:</span>
              <span className="text-white font-extrabold">{streamLeaning || 'Arts'}</span>
            </div>
          </div>
        </div>

        {/* 3 TOP PROGRESS RING METRIC CARDS (FRAMER MOTION ANIMATED) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* CARD 1: VIVID GRADIENT PURPLE/FUCHSIA CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white shadow-2xl shadow-purple-500/25 flex flex-col items-center text-center space-y-4 glow-purple-card cursor-pointer"
          >
            <span className="text-xs font-semibold text-purple-200 tracking-wider uppercase">
              Overall Aptitude
            </span>

            {/* CIRCULAR PROGRESS GAUGE */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
                <circle
                  cx="45"
                  cy="45"
                  r="38"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="45"
                  cy="45"
                  r="38"
                  stroke="#ffffff"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={strokeCircumference}
                  initial={{ strokeDashoffset: strokeCircumference }}
                  animate={{ strokeDashoffset: aptitudeOffset }}
                  transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
                  strokeLinecap="round"
                />
              </svg>
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="absolute text-2xl font-black tracking-tight text-white"
              >
                {aptitudeScore}%
              </motion.span>
            </div>

            <div>
              <h3 className="text-lg font-bold">Your Aptitude Ratio</h3>
              <p className="text-xs text-purple-100/90 mt-1 leading-relaxed line-clamp-2">
                {aptitudeAnalysis?.overallLabel || 'Strong logical reasoning & spatial comprehension.'}
              </p>
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#aptitude-section"
              className="mt-auto px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-extrabold uppercase tracking-wider transition-all backdrop-blur-md border border-white/30"
            >
              READ MORE
            </motion.a>
          </motion.div>

          {/* CARD 2: GLASSMORPHIC BLUE/CYAN CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 text-white shadow-xl flex flex-col items-center text-center space-y-4 hover:border-cyan-500/40 cursor-pointer"
          >
            <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
              Interest Alignment
            </span>

            {/* CIRCULAR PROGRESS GAUGE */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
                <circle
                  cx="45"
                  cy="45"
                  r="38"
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="45"
                  cy="45"
                  r="38"
                  stroke="url(#cyanGrad)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={strokeCircumference}
                  initial={{ strokeDashoffset: strokeCircumference }}
                  animate={{ strokeDashoffset: riasecOffset }}
                  transition={{ duration: 1.6, ease: 'easeOut', delay: 0.4 }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="absolute text-2xl font-black tracking-tight text-white"
              >
                {riasecScore}%
              </motion.span>
            </div>

            <div>
              <h3 className="text-lg font-bold">RIASEC Fit Ratio</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                Primary Profile: {careerInterestProfile?.primaryInterestType || 'Artistic-Social-Enterprising'}
              </p>
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#riasec-section"
              className="mt-auto px-6 py-2 rounded-full bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 text-xs font-extrabold uppercase tracking-wider transition-all"
            >
              READ MORE
            </motion.a>
          </motion.div>

          {/* CARD 3: GLASSMORPHIC PURPLE/PINK CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 text-white shadow-xl flex flex-col items-center text-center space-y-4 hover:border-pink-500/40 cursor-pointer"
          >
            <span className="text-xs font-semibold text-pink-400 tracking-wider uppercase">
              Top Career Match
            </span>

            {/* CIRCULAR PROGRESS GAUGE */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
                <circle
                  cx="45"
                  cy="45"
                  r="38"
                  stroke="#1e293b"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="45"
                  cy="45"
                  r="38"
                  stroke="url(#pinkGrad)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={strokeCircumference}
                  initial={{ strokeDashoffset: strokeCircumference }}
                  animate={{ strokeDashoffset: fitOffset }}
                  transition={{ duration: 1.6, ease: 'easeOut', delay: 0.5 }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="absolute text-2xl font-black tracking-tight text-white"
              >
                {fitScore}%
              </motion.span>
            </div>

            <div>
              <h3 className="text-lg font-bold font-sans">Career Fit Ratio</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                Top Choice: {careerRecommendations?.paths?.[0]?.title || 'Visual & Communication Designer'}
              </p>
            </div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#recommendations-section"
              className="mt-auto px-6 py-2 rounded-full bg-pink-600/30 hover:bg-pink-600/50 text-pink-200 border border-pink-500/40 text-xs font-extrabold uppercase tracking-wider transition-all"
            >
              READ MORE
            </motion.a>
          </motion.div>
        </div>

        {/* BOTTOM VISUAL ANALYTICS ROW (GRADIENT BARS + DONUT CHART - MATCHING REFERENCE IMAGE) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-800/80">
          {/* Subtitle / Insights Side Card */}
          <div className="md:col-span-5 p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase text-indigo-400 tracking-wider">
                Discovery Executive Summary
              </span>
              <h3 className="text-lg font-extrabold text-white mt-1">
                Profile Insights for {displayName}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {whoIsStudent?.ownDirection?.summaryConclusion ||
                'Demonstrates strong natural curiosity, independent problem-solving skills, and a clear leaning toward creative design and technology.'}
            </p>

            <div className="pt-2 space-y-2 border-t border-slate-800/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Natural Strengths:</span>
                <span className="font-bold text-emerald-400">Visual & Logical</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target Stream:</span>
                <span className="font-bold text-indigo-300">{streamLeaning || 'Arts & Design'}</span>
              </div>
            </div>
          </div>

          {/* Bar Chart & Donut Chart Panel */}
          <div className="md:col-span-7 p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Color Gradient Bars */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-3">
                Aptitude & Skill Ratios
              </h4>

              {/* Bar 1 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">Logical Reasoning</span>
                  <span className="font-bold text-purple-400">{aptitudeAnalysis?.logicalAbility?.score ?? 80}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${aptitudeAnalysis?.logicalAbility?.score ?? 80}%` }}
                    transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>

              {/* Bar 2 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">Verbal Ability</span>
                  <span className="font-bold text-fuchsia-400">{aptitudeAnalysis?.verbalAbility?.score ?? 60}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${aptitudeAnalysis?.verbalAbility?.score ?? 60}%` }}
                    transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full"
                  />
                </div>
              </div>

              {/* Bar 3 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">Numerical Computation</span>
                  <span className="font-bold text-amber-400">{aptitudeAnalysis?.numericalAbility?.score ?? 40}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${aptitudeAnalysis?.numericalAbility?.score ?? 40}%` }}
                    transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
                  />
                </div>
              </div>

              {/* Bar 4 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">Overall Fit Score</span>
                  <span className="font-bold text-emerald-400">{fitScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${fitScore}%` }}
                    transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Radial Donut Chart */}
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                RIASEC Distribution
              </h4>

              <div className="relative w-28 h-28 flex items-center justify-center">
                <div
                  className="w-full h-full rounded-full animate-spin-slow"
                  style={{
                    background: `conic-gradient(
                      #a855f7 0% 35%,
                      #06b6d4 35% 60%,
                      #ec4899 60% 80%,
                      #10b981 80% 100%
                    )`,
                  }}
                />
                <div className="absolute inset-3 bg-slate-950 rounded-full flex flex-col items-center justify-center">
                  <span className="text-xs font-black text-white">Top 3</span>
                  <span className="text-[10px] text-indigo-300 font-bold">ASE Code</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-300">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>Artistic (35%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  <span>Social (25%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  <span>Enterprising (20%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Investigative (20%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 01. WHO IS STUDENT? */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            WHO IS {displayName.toUpperCase()}?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Academic Profile */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3 transition-all hover:border-indigo-500/40"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Current Academic Profile
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <span className="text-slate-400">Grade & Board:</span>{' '}
                <strong className="text-white">{whoIsStudent?.academicProfile?.gradeAndBoard || 'Grade 8'}</strong>
              </li>
              <li>
                <span className="text-slate-400">Subjects Studied:</span>{' '}
                <span className="text-slate-200">{whoIsStudent?.academicProfile?.subjectsStudied || 'English, Maths, Science, Social Studies'}</span>
              </li>
              <li className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 flex items-center justify-between">
                <span>Easiest Subject:</span>{' '}
                <strong className="bg-emerald-600/30 px-2 py-0.5 rounded text-emerald-200">{whoIsStudent?.academicProfile?.easiestSubject || 'English'}</strong>
              </li>
              <li className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-300 flex items-center justify-between">
                <span>Hardest Subject:</span>{' '}
                <strong className="bg-amber-600/30 px-2 py-0.5 rounded text-amber-200">{whoIsStudent?.academicProfile?.hardestSubject || 'Maths'}</strong>
              </li>
            </ul>
          </motion.div>

          {/* Outside Classroom */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3 transition-all hover:border-indigo-500/40"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Compass className="w-4 h-4" /> Who Outside the Classroom
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {whoIsStudent?.outsideClassroom || 'Engages in creative hobbies, reading, and self-directed projects.'}
            </p>
          </motion.div>
        </div>

        {/* Own Direction & Conclusion */}
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-indigo-900/50 space-y-4 shadow-lg"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            {displayName}&apos;s Own Direction & Synthesis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
              <span className="text-slate-400 block mb-1">10-Year Vision:</span>
              <strong className="text-white">{whoIsStudent?.ownDirection?.tenYearVision || 'Creating products, writing, or designs'}</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
              <span className="text-slate-400 block mb-1">Family Situation:</span>
              <strong className="text-white">{whoIsStudent?.ownDirection?.familySituation || 'Full choice / No pressure'}</strong>
            </div>
          </div>
          <p className="text-xs text-indigo-200 leading-relaxed pt-2 border-t border-slate-800/80">
            {whoIsStudent?.ownDirection?.summaryConclusion || 'Independent learner profile oriented toward creative output and design.'}
          </p>
        </motion.div>
      </motion.section>

      {/* 02. APTITUDE AND ABILITY ANALYSIS */}
      <motion.section
        id="aptitude-section"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            APTITUDE AND ABILITY ANALYSIS
          </h2>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase">Overall Aptitude Score</h3>
            <p className="text-2xl font-extrabold text-white">{aptitudeAnalysis?.overallScore || 58}% Score</p>
          </div>
          <span className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md">
            {aptitudeAnalysis?.overallLabel || 'Average, with strong logical reasoning'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Numerical */}
          <motion.div whileHover={{ y: -4 }} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Numerical Ability</span>
              <span className="text-xs font-extrabold text-amber-400">{aptitudeAnalysis?.numericalAbility?.score ?? 40}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                whileInView={{ width: `${aptitudeAnalysis?.numericalAbility?.score ?? 40}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="bg-amber-500 h-full rounded-full"
              />
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/50 text-amber-300 text-[10px] font-semibold">
              {aptitudeAnalysis?.numericalAbility?.statusLabel || 'Needs Development'}
            </span>
            <p className="text-[11px] text-slate-400 leading-normal">
              {aptitudeAnalysis?.numericalAbility?.analysisText || 'Targeted numerical practice over the next 12 months can close computation gaps.'}
            </p>
          </motion.div>

          {/* Logical */}
          <motion.div whileHover={{ y: -4 }} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Logical & Reasoning</span>
              <span className="text-xs font-extrabold text-emerald-400">{aptitudeAnalysis?.logicalAbility?.score ?? 80}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                whileInView={{ width: `${aptitudeAnalysis?.logicalAbility?.score ?? 80}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-[10px] font-semibold">
              {aptitudeAnalysis?.logicalAbility?.statusLabel || 'Good'}
            </span>
            <p className="text-[11px] text-slate-400 leading-normal">
              {aptitudeAnalysis?.logicalAbility?.analysisText || 'Strong pattern recognition and deductive logic capability.'}
            </p>
          </motion.div>

          {/* Verbal */}
          <motion.div whileHover={{ y: -4 }} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Verbal & Comprehension</span>
              <span className="text-xs font-extrabold text-sky-400">{aptitudeAnalysis?.verbalAbility?.score ?? 60}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                whileInView={{ width: `${aptitudeAnalysis?.verbalAbility?.score ?? 60}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="bg-sky-500 h-full rounded-full"
              />
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded bg-sky-950/60 border border-sky-800/50 text-sky-300 text-[10px] font-semibold">
              {aptitudeAnalysis?.verbalAbility?.statusLabel || 'Average'}
            </span>
            <p className="text-[11px] text-slate-400 leading-normal">
              {aptitudeAnalysis?.verbalAbility?.analysisText || 'Good passage comprehension and main point identification.'}
            </p>
          </motion.div>
        </div>

        {/* Counsellor Notes */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
          <h4 className="font-semibold text-indigo-400 uppercase text-[11px]">Counsellor Note on Aptitude:</h4>
          <ul className="space-y-1.5">
            {(aptitudeAnalysis?.counsellorNotes || [
              'Gap between logical and numerical ability is common in creative thinkers.',
              'Aptitude at Grade 8 is an input to planning, not a fixed limit.',
            ]).map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* 03. CAREER INTEREST PROFILE (RIASEC) */}
      <motion.section
        id="riasec-section"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              CAREER INTEREST PROFILE (RIASEC)
            </h2>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-bold">
            Primary Code: {careerInterestProfile?.primaryInterestType || 'Artistic-Social-Enterprising (ASE)'}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(
            careerInterestProfile?.riasecScores || { artistic: 67, social: 67, enterprising: 67, investigative: 22, realistic: 0, conventional: 0 }
          ).map(([dim, score]) => (
            <motion.div
              key={dim}
              whileHover={{ y: -3, scale: 1.02 }}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 hover:border-indigo-500/40 transition-all"
            >
              <div className="flex justify-between text-xs capitalize">
                <span className="font-medium text-slate-300">{dim}</span>
                <span className="font-bold text-indigo-400">{score}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  whileInView={{ width: `${score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-indigo-500 h-full rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* MATCHING USER SCREENSHOT STYLING */}
        <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/60 text-slate-200 space-y-3 shadow-lg">
          <h3 className="text-sm font-bold text-amber-400 tracking-wide uppercase">
            What the {careerInterestProfile?.primaryInterestType || 'ASE'} Profile Looks Like in Practice:
          </h3>
          <ul className="space-y-2.5 text-xs leading-relaxed text-slate-200">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <div>
                <strong className="text-white">Artistic:</strong>{' '}
                {careerInterestProfile?.inPracticeBreakdown?.artistic ||
                  'Chose to design a campaign over analysing data, write a story over organising an event, and direct a film over planning logistics.'}
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <div>
                <strong className="text-white">Social:</strong>{' '}
                {careerInterestProfile?.inPracticeBreakdown?.social ||
                  'Chose to mentor a younger student, counsel a peer, and teach a concept over competing options.'}
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <div>
                <strong className="text-white">Enterprising:</strong>{' '}
                {careerInterestProfile?.inPracticeBreakdown?.enterprising ||
                  'Chose to lead and pitch a new idea, lead a project over managing finances, and start an initiative from scratch.'}
              </div>
            </li>
          </ul>
        </div>
      </motion.section>

      {/* 04. MOTIVATORS AND VALUES */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
            04
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            MOTIVATORS AND VALUES
          </h2>
        </div>

        {/* PROGRESS BARS */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            What Matters Most to {displayName}
          </h3>

          <div className="space-y-3">
            {(
              motivatorsAndValues?.topMotivators || [
                { label: 'Doing meaningful work (even if it pays less)', percentage: 100 },
                { label: 'Making something people can see and use', percentage: 90 },
                { label: 'Freedom to decide how she spends her time', percentage: 80 },
                { label: 'Being well-known or respected in her field', percentage: 50 },
                { label: 'Earning enough to be comfortable and secure', percentage: 40 },
              ]
            ).map((item, idx) => {
              let barBg = 'bg-emerald-500';
              let textColor = 'text-emerald-400';
              if (item.percentage === 80) {
                barBg = 'bg-indigo-500';
                textColor = 'text-indigo-400';
              } else if (item.percentage <= 50) {
                barBg = 'bg-slate-600';
                textColor = 'text-slate-400';
              }

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-200 font-medium">{item.label}</span>
                    <span className={`font-extrabold ${textColor}`}>{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-5 rounded-lg overflow-hidden p-0.5 border border-slate-800">
                    <motion.div
                      initial={{ width: '0%' }}
                      whileInView={{ width: `${item.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: idx * 0.1, ease: 'easeOut' }}
                      className={`${barBg} h-full rounded-md`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scenario Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {(
            motivatorsAndValues?.scenarioAnalysis || [
              { title: 'Group credit question', finding: 'Not bothered at all if personal contribution goes unnoticed. Strong signal of intrinsic motivation.' },
              { title: 'Free afternoon choice', finding: 'Read, write, or create something. Creation is the default state.' },
            ]
          ).map((sc, idx) => (
            <motion.div whileHover={{ y: -3 }} key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">{sc.title}</span>
              <p className="text-xs text-slate-300 leading-relaxed">{sc.finding}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 05. PERSONALITY AND WORKING STYLE */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
            05
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            PERSONALITY AND WORKING STYLE
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(
            personalityAndWorkingStyle?.traits || [
              { title: 'Creative', description: 'Wired to make things.' },
              { title: 'People-oriented', description: 'Genuinely drawn to helping.' },
              { title: 'Independent', description: 'Figures things out herself.' },
              { title: 'Intrinsically driven', description: 'Motivated by output impact.' },
            ]
          ).map((tr, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.03 }}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 hover:border-indigo-500/40 transition-all"
            >
              <h3 className="text-xs font-extrabold text-indigo-300">{tr.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{tr.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Strengths in Working Style</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {(
                personalityAndWorkingStyle?.strengths || [
                  'Visual and aesthetic thinking.',
                  'Communication confidence and public speaking.',
                  'Creative stamina.',
                ]
              ).map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Areas to Develop</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {(
                personalityAndWorkingStyle?.areasToDevelop || [
                  'Numerical foundations: Targeted work to close basic numeracy gap.',
                  'Structured planning: Ability to plan long projects systematically.',
                ]
              ).map((dev, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{dev}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* 06. CAREER CLUSTERS */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
            06
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            CAREER CLUSTERS
          </h2>
        </div>

        <div className="space-y-3">
          {(
            careerClusters?.clusterScores || [
              { name: 'Creative Arts and Design', matchPercentage: 88 },
              { name: 'Media, Communication and Writing', matchPercentage: 82 },
              { name: 'Education and Teaching', matchPercentage: 70 },
              { name: 'Human Services and Social Impact', matchPercentage: 65 },
            ]
          ).map((cls, idx) => (
            <div key={idx} className="flex items-center gap-4 text-xs">
              <span className="w-52 shrink-0 font-medium text-slate-300 truncate">{cls.name}</span>
              <div className="flex-1 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: '0%' }}
                  whileInView={{ width: `${cls.matchPercentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: idx * 0.1, ease: 'easeOut' }}
                  className="bg-indigo-500 h-full rounded-full"
                />
              </div>
              <span className="w-10 text-right font-bold text-indigo-400">{cls.matchPercentage}%</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 07. CAREER PATH RECOMMENDATIONS */}
      <motion.section
        id="recommendations-section"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
            07
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            CAREER PATH RECOMMENDATIONS
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Career Path</th>
                <th className="p-3">Cluster</th>
                <th className="p-3">Fit Rating</th>
                <th className="p-3">Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950">
              {(
                careerRecommendations?.paths || [
                  { rank: 1, title: 'Graphic Designer or Visual Communication Designer', cluster: 'Creative Arts and Design', fitRating: 'Very High: 92', fitScore: 92, skillsScore: 80, recommendationType: 'Top Choice' },
                  { rank: 2, title: 'Content Creator or Brand Storyteller', cluster: 'Media, Communication and Writing', fitRating: 'Very High: 88', fitScore: 88, skillsScore: 78, recommendationType: 'Top Choice' },
                ]
              ).map((path) => (
                <tr key={path.rank} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-bold text-indigo-400">{path.rank}</td>
                  <td className="p-3 font-semibold text-white">{path.title}</td>
                  <td className="p-3 text-slate-400">{path.cluster}</td>
                  <td className="p-3 font-bold text-emerald-400">{path.fitRating}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        path.recommendationType === 'Top Choice'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                      }`}
                    >
                      {path.recommendationType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Deep Dive Box */}
        <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 space-y-3">
          <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
            {careerRecommendations?.topRecommendationDeepDive?.title || 'Why Graphic & Visual Design is Top Choice'}
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {(
              careerRecommendations?.topRecommendationDeepDive?.arguments || [
                'Existing evidence of sustained visual practice (drawing).',
                'Design careers are international, well-paid, and highly relevant across industries.',
              ]
            ).map((arg, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span>{arg}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* 08. STREAM AND SUBJECT RECOMMENDATION */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
            08
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            STREAM AND SUBJECT RECOMMENDATION
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Humanities & Arts */}
          <motion.div whileHover={{ y: -4 }} className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/50 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
              {streamAndSubjectRecommendation?.humanitiesAndArts?.status || 'RECOMMENDED'}
            </span>
            <h3 className="text-sm font-bold text-white">Humanities and Arts</h3>
            <p className="text-xs text-slate-300 leading-normal">
              {streamAndSubjectRecommendation?.humanitiesAndArts?.reason || 'Direct alignment with creative interests and top career paths.'}
            </p>
          </motion.div>

          {/* Science */}
          <motion.div whileHover={{ y: -4 }} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-indigo-900 text-indigo-200 text-[10px] font-extrabold uppercase">
              {streamAndSubjectRecommendation?.science?.status || 'POSSIBLE ALTERNATIVE'}
            </span>
            <h3 className="text-sm font-bold text-white">Science</h3>
            <p className="text-xs text-slate-400 leading-normal">
              {streamAndSubjectRecommendation?.science?.reason || 'Viable if developing specific interest in design technology or animation.'}
            </p>
          </motion.div>

          {/* Commerce */}
          <motion.div whileHover={{ y: -4 }} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-extrabold uppercase">
              {streamAndSubjectRecommendation?.commerce?.status || 'NOT RECOMMENDED'}
            </span>
            <h3 className="text-sm font-bold text-white">Commerce</h3>
            <p className="text-xs text-slate-400 leading-normal">
              {streamAndSubjectRecommendation?.commerce?.reason || 'Low alignment with motivators and stated career vision.'}
            </p>
          </motion.div>
        </div>

        {/* Subject Combinations */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            Recommended Subject Combination: {streamAndSubjectRecommendation?.recommendedSubjectCombination?.streamName || 'Humanities and Arts'}
          </h3>
          <p className="text-xs text-slate-300">
            <strong>Core:</strong>{' '}
            {(streamAndSubjectRecommendation?.recommendedSubjectCombination?.coreSubjects || ['English Literature', 'Fine Art', 'History']).join(', ')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {(
              streamAndSubjectRecommendation?.recommendedSubjectCombination?.specializations || [
                { name: 'Psychology', reason: 'Deepens people intelligence.' },
                { name: 'Media Studies', reason: 'Direct pathway into content creation.' },
              ]
            ).map((sp, idx) => (
              <motion.div whileHover={{ y: -2 }} key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-xs text-indigo-300 block">{sp.name}</strong>
                <p className="text-[11px] text-slate-400 leading-snug">{sp.reason}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 09. PROFILE ROADMAP: GRADE 8 TO UNIVERSITY */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
            09
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            PROFILE ROADMAP: GRADE 8 TO UNIVERSITY
          </h2>
        </div>

        {/* VISUAL CONNECTED TIMELINE */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-purple-500 before:to-pink-500">
          {[
            profileRoadmap?.phase1 || { title: 'Phase 1: Grade 8 to 9', subtitle: 'Establish Visual Identity', bullets: ['Create sketchbook portfolio'], target: '20-piece portfolio' },
            profileRoadmap?.phase2 || { title: 'Phase 2: Grade 9 to 11', subtitle: 'Build Visible Output', bullets: ['Start creative project'], target: 'One public project' },
            profileRoadmap?.phase3 || { title: 'Phase 3: Grade 11 to 12', subtitle: 'University Application', bullets: ['Compile formal portfolio'], target: 'University shortlist' },
          ].map((phase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-all"
            >
              {/* Connected Timeline Node */}
              <div className="absolute -left-[31px] top-6 w-4 h-4 rounded-full bg-indigo-600 border-2 border-slate-900 shadow-lg shadow-indigo-500/50" />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-lg bg-indigo-950 text-indigo-300 text-xs font-extrabold border border-indigo-800">
                  {phase?.title}
                </span>
                <span className="text-xs text-indigo-400 font-bold">{phase?.subtitle}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {phase?.bullets?.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <span className="text-indigo-400">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-900 text-indigo-200 text-xs font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Target: {phase?.target}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 10. SUMMARY AND NEXT STEPS */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm">
            10
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            SUMMARY AND NEXT STEPS
          </h2>
        </div>

        {/* SUMMARY TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <tbody className="divide-y divide-slate-800 bg-slate-950">
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-bold text-indigo-400 bg-slate-900/60 w-48">Personality Type</td>
                <td className="p-3 text-white font-medium">{summaryAndNextSteps?.summaryTable?.personalityType || 'Creative, Independent, Intrinsically Motivated'}</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-bold text-indigo-400 bg-slate-900/60">Top Interest Codes</td>
                <td className="p-3 text-slate-200">{summaryAndNextSteps?.summaryTable?.topInterestCodes || 'Artistic (67%), Social (67%), Enterprising (67%)'}</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-bold text-indigo-400 bg-slate-900/60">Core Motivators</td>
                <td className="p-3 text-slate-200">{summaryAndNextSteps?.summaryTable?.coreMotivators || 'Meaningful Work, Creative Output, Autonomy'}</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-bold text-indigo-400 bg-slate-900/60">Strongest Aptitude</td>
                <td className="p-3 text-slate-200">{summaryAndNextSteps?.summaryTable?.strongestAptitude || 'Logical Ability (80%)'}</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-bold text-indigo-400 bg-slate-900/60">Recommended Stream</td>
                <td className="p-3 text-emerald-400 font-bold">{summaryAndNextSteps?.summaryTable?.recommendedStream || 'Humanities and Arts'}</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-bold text-indigo-400 bg-slate-900/60">Top Career Path</td>
                <td className="p-3 text-white font-bold">{summaryAndNextSteps?.summaryTable?.topCareerPath || 'Graphic Designer or Visual Communication Designer'}</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-bold text-indigo-400 bg-slate-900/60">Key Differentiator</td>
                <td className="p-3 text-indigo-300 font-semibold">{summaryAndNextSteps?.summaryTable?.keyDifferentiator || 'Drawing practice plus public speaking'}</td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3 font-bold text-indigo-400 bg-slate-900/60">Phase 1 Priority</td>
                <td className="p-3 text-slate-200">{summaryAndNextSteps?.summaryTable?.phase1Priority || 'Build a 20-piece portfolio and enter one public speaking competition'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BOOKING CTA */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-800 text-center space-y-4 shadow-xl"
        >
          <h3 className="text-lg font-bold text-white">Ready to take this further?</h3>
          <p className="text-xs text-indigo-200 max-w-xl mx-auto leading-relaxed">
            {summaryAndNextSteps?.bookingCtaText ||
              'The Uni Discovery team works with students from Grade 8 onward to build creative profile, portfolio strategy, and university application preparation.'}
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.theunidiscovery.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg"
          >
            Visit www.theunidiscovery.com to Book a Session
          </motion.a>
        </motion.div>
      </motion.section>

      {/* 11. SUBMITTED DIAGNOSTIC ANSWERS (COLLAPSIBLE REVIEW SECTION) */}
      {rawAnswers && Object.keys(rawAnswers).length > 0 && (
        <section className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-800 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-white">Review Submitted Diagnostic Answers</h3>
                <p className="text-xs text-slate-400">Click to view raw responses submitted for this assessment ({Object.keys(rawAnswers).length} questions)</p>
              </div>
            </div>
            {showAnswers ? (
              <ChevronUp className="w-5 h-5 text-indigo-400 shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-indigo-400 shrink-0" />
            )}
          </button>

          <AnimatePresence>
            {showAnswers && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {Object.entries(rawAnswers).map(([key, val], idx) => (
                    <div key={key} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                        <span>Q{idx + 1} ({key})</span>
                      </div>
                      <p className="text-slate-200 font-medium">
                        {Array.isArray(val) ? val.join(', ') : String(val || '(No answer)')}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}
    </div>
  );
};
