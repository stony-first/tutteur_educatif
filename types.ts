export interface Message {
  role: 'user' | 'model';
  content: string;
  id: string;
  isStreaming?: boolean;
}

export enum TopicId {
  RESPIRATORY = 'respiratoire',
  CIRCULATORY = 'circulatoire',
  DIGESTIVE = 'digestif',
  NERVOUS = 'nerveux',
  MUSCULAR = 'musculaire',
  GENERAL = 'general'
}

export interface Topic {
  id: TopicId;
  title: string;
  description: string;
  icon: string; // Lucide icon name placeholder
  color: string;
}

export interface ChatSessionConfig {
  apiKey: string;
  topic: TopicId;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}