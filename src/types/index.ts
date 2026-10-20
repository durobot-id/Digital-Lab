export interface QuizQuestion {
  id: string;
  question: string;
  diagramSvg?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  conceptTag: string;
}

export interface FormulaItem {
  name: string;
  formula: string;
  description: string;
  variables: { symbol: string; name: string; unit: string }[];
}

export interface ContentSection {
  title: string;
  content: string[];
  keyPoints?: string[];
}

export interface SuggestedExperiment {
  step: number;
  title: string;
  instruction: string;
  expectedObservation: string;
}

export interface TopicData {
  id: string;
  slug: string;
  title: string;
  badge: string;
  gradeLevel: string;
  durationMinutes: number;
  iconName: string;
  summary: string;
  learningObjectives: string[];
  prerequisites: string[];
  formalContent: {
    introduction: string;
    sections: ContentSection[];
    formulas: FormulaItem[];
    realWorldApplications: string[];
    safetyAndAssumptions: string[];
  };
  labConfig: {
    goal: string;
    suggestedExperiments: SuggestedExperiment[];
    variables: {
      independent: string;
      dependent: string;
      controlled: string[];
    };
  };
  quiz: QuizQuestion[];
}

export interface TopicProgress {
  materialCompleted: boolean;
  labCompleted: boolean;
  quizScore?: number;
  quizTotal?: number;
  quizPercentage?: number;
  quizDate?: string;
  lastUpdated?: string;
}

export interface UserOverallProgress {
  [topicSlug: string]: TopicProgress;
}
