const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'program_manager';
}

export interface CollegeGoals {
  targetDegree?: string;
  targetCountries?: string[];
  targetUniversities?: string;
  selectionPriorities?: string[];
}

export interface StudentProfile {
  _id?: string;
  userId: string;
  classGroup?: '6-8' | '9-10' | '11-12';
  classLevel?: number;
  grade?: number;
  country?: string;
  schoolBoard?: string;
  subjects?: string[];
  stream?: string;
  academicPerformance?: string;
  standardizedScores?: string;
  collegeGoals?: CollegeGoals;
  onboardingCompleted?: boolean;
  age?: number;
  school?: string;
  city?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface DiagnosticQuestion {
  questionId: string;
  section: string;
  questionText: string;
  helperText?: string;
  questionType: 'single_choice' | 'multiple_choice' | 'text' | 'rating';
  options?: QuestionOption[];
  applicableGrades: number[];
  applicableClassGroups: ('6-8' | '9-10' | '11-12')[];
  required: boolean;
  order: number;
  evaluationCategory: string;
}

export interface AssessmentData {
  _id: string;
  userId: string;
  classGroup: '6-8' | '9-10' | '11-12';
  grade: number;
  status: 'in_progress' | 'completed';
  currentQuestionIndex: number;
  answers: Record<string, unknown>;
  startedAt: string;
  lastSavedAt: string;
  submittedAt?: string;
}

export interface Grade68ReportPayload {
  studentName: string;
  grade: string;
  assessmentDate: string;
  streamLeaning: string;
  whoIsStudent: {
    academicProfile: {
      gradeAndBoard: string;
      subjectsStudied: string;
      easiestSubject: string;
      hardestSubject: string;
    };
    outsideClassroom: string;
    ownDirection: {
      tenYearVision: string;
      streamLeaning: string;
      familySituation: string;
      recognition: string;
      learningPreference: string;
      summaryConclusion: string;
    };
  };
  aptitudeAnalysis: {
    overallScore: number;
    overallLabel: string;
    numericalAbility: { score: number; statusLabel: string; analysisText: string };
    logicalAbility: { score: number; statusLabel: string; analysisText: string };
    verbalAbility: { score: number; statusLabel: string; analysisText: string };
    counsellorNotes: string[];
  };
  careerInterestProfile: {
    riasecScores: {
      artistic: number;
      social: number;
      enterprising: number;
      investigative: number;
      realistic: number;
      conventional: number;
    };
    primaryInterestType: string;
    primarySummary: string;
    inPracticeBreakdown: {
      artistic: string;
      social: string;
      enterprising: string;
    };
  };
  motivatorsAndValues: {
    topMotivators: Array<{ label: string; percentage: number }>;
    scenarioAnalysis: Array<{ title: string; finding: string }>;
    counsellorInterpretation: string[];
  };
  personalityAndWorkingStyle: {
    traits: Array<{ title: string; description: string }>;
    strengths: string[];
    areasToDevelop: string[];
  };
  careerClusters: {
    clusterScores: Array<{ name: string; matchPercentage: number }>;
    topClustersExplained: Array<{ rank: number; name: string; matchPercentage: number; explanation: string }>;
  };
  careerRecommendations: {
    paths: Array<{
      rank: number;
      title: string;
      cluster: string;
      fitRating: string;
      fitScore: number;
      skillsScore: number;
      recommendationType: 'Top Choice' | 'Good Choice';
    }>;
    topRecommendationDeepDive: {
      title: string;
      arguments: string[];
    };
  };
  streamAndSubjectRecommendation: {
    humanitiesAndArts: { status: 'RECOMMENDED' | 'POSSIBLE ALTERNATIVE' | 'NOT RECOMMENDED'; reason: string };
    science: { status: 'RECOMMENDED' | 'POSSIBLE ALTERNATIVE' | 'NOT RECOMMENDED'; reason: string };
    commerce: { status: 'RECOMMENDED' | 'POSSIBLE ALTERNATIVE' | 'NOT RECOMMENDED'; reason: string };
    recommendedSubjectCombination: {
      streamName: string;
      coreSubjects: string[];
      specializations: Array<{ name: string; reason: string }>;
    };
  };
  profileRoadmap: {
    phase1: { title: string; subtitle: string; bullets: string[]; target: string };
    phase2: { title: string; subtitle: string; bullets: string[]; target: string };
    phase3: { title: string; subtitle: string; bullets: string[]; target: string };
    uniqueDifferentiators: string[];
  };
  summaryAndNextSteps: {
    summaryTable: {
      personalityType: string;
      topInterestCodes: string;
      coreMotivators: string;
      strongestAptitude: string;
      recommendedStream: string;
      topCareerPath: string;
      keyDifferentiator: string;
      phase1Priority: string;
    };
    bookingCtaText: string;
  };
}

export interface EvaluationPayload {
  studentName?: string;
  grade: number;
  classGroup: '6-8' | '9-10' | '11-12';
  academicStrengths: string[];
  effortAreas: string[];
  genuineInterests: string[];
  curiosityPattern: string;
  learningBehavior: string;
  activityPreferences: string[];
  careerCuriosity: string[];
  diagnosticGoal?: string;
  collegeGuidance?: {
    degreeDirection?: string;
    targetUniversities?: string[];
    profileStrengths?: string[];
    profileGaps?: string[];
  };
  recommendedNextSteps: string[];
  grade68DiscoveryReport?: Grade68ReportPayload;
}

export interface DiagnosticResultData {
  _id: string;
  userId: string;
  assessmentId: string | { _id?: string; answers?: Record<string, string | string[]> };
  classGroup: '6-8' | '9-10' | '11-12';
  grade: number;
  evaluation: EvaluationPayload;
  generatedAt: string;
}

export interface AuthMeResponseData {
  user: User;
  profile: StudentProfile;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
    cache: 'no-store',
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as ApiResponse<T>;
}

export const apiClient = {
  // Health
  getHealth: () => request<{ message: string }>('/health'),

  // Auth
  register: (payload: { name: string; email: string; password?: string }) =>
    request<AuthMeResponseData>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password?: string }) =>
    request<AuthMeResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request<null>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => request<AuthMeResponseData>('/auth/me'),

  forgotPassword: (email: string) =>
    request<null>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (payload: { token: string; password?: string }) =>
    request<null>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Profile
  getProfile: () => request<{ profile: StudentProfile }>('/profile'),

  updateProfile: (payload: Partial<StudentProfile>) =>
    request<{ profile: StudentProfile }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Diagnostic & Assessment
  getDiagnosticQuestions: () =>
    request<{
      grade: number;
      classGroup: '6-8' | '9-10' | '11-12';
      totalQuestions: number;
      questions: DiagnosticQuestion[];
    }>('/diagnostic/questions'),

  getActiveAssessment: () =>
    request<{ assessment: AssessmentData | null }>('/diagnostic/assessment/active'),

  startAssessment: () =>
    request<{ assessment: AssessmentData }>('/diagnostic/assessment/start', {
      method: 'POST',
    }),

  saveProgress: (currentQuestionIndex: number, answers: Record<string, unknown>) =>
    request<{ assessment: AssessmentData }>('/diagnostic/assessment/save', {
      method: 'POST',
      body: JSON.stringify({ currentQuestionIndex, answers }),
    }),

  submitAssessment: (currentQuestionIndex: number, answers: Record<string, unknown>) =>
    request<{
      assessment: AssessmentData;
      resultId: string;
      evaluation: EvaluationPayload;
    }>('/diagnostic/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ currentQuestionIndex, answers }),
    }),

  getDiagnosticResults: () =>
    request<{ results: DiagnosticResultData[] }>('/diagnostic/results'),

  getDiagnosticResultById: (id: string) =>
    request<{ result: DiagnosticResultData }>(`/diagnostic/results/${id}`),
};

export const checkBackendHealth = async () => {
  return apiClient.getHealth();
};
