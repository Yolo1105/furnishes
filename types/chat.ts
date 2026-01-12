import type { PreferenceExtraction, PreferenceRemoval, SourceHighlight } from './preferences';

export type MessageType = 'text' | 'greeting' | 'status' | 'taskCard' | 'feedback';

// Base message interface (used by ChatAreaMessage)
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
  isEssential?: boolean;
}

export interface TaskCard {
  id: string;
  text: string;
  isBookmarked?: boolean;
}

export interface FeedbackMessage {
  text: string;
  badge?: string; // "U" for user
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  content?: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isEssential?: boolean;
  taskCard?: TaskCard;
  feedback?: FeedbackMessage;
  preferenceExtractions?: PreferenceExtraction[];
  preferenceRemovals?: PreferenceRemoval[];
  sourceHighlights?: SourceHighlight[];
}
