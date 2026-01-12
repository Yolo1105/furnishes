// ProjectInfo is exported from components/pages/chatbot/ProjectInfoPanel
// We'll define it here to avoid circular dependencies
export interface ProjectInfo {
  roomType: string;
  designStyle: string;
  budgetRange: string;
  colorTheme: string[];
  mustBuyFurniture: string[];
  furnitureLayout: string;
}

export type PreferenceSnapshotSource = 'auto' | 'confirmation' | 'manual';

export interface PreferenceChange {
  field: keyof ProjectInfo;
  previousValue: string | string[];
  newValue: string | string[];
  added?: string[];
  removed?: string[];
  summary: string;
}

export interface PreferenceSnapshot {
  id: string;
  chatId: string;
  messageId: string;
  timestamp: Date;
  userMessage: string;
  source: PreferenceSnapshotSource;
  projectInfo: ProjectInfo;
  changes: PreferenceChange[];
}

// Preference extraction metadata types
export interface PreferenceExtraction {
  field: keyof ProjectInfo;
  value: string | string[];
  confidence: 'high' | 'medium' | 'low';
  sourceMessage: string;
  sourceMessageId: string;
  isUpdate: boolean; // true if updating existing value, false if new
  previousValue?: string | string[];
  timestamp: Date;
}

export interface PreferenceRemoval {
  field: keyof ProjectInfo;
  value: string | string[]; // specific value(s) removed
  sourceMessage: string;
  sourceMessageId: string;
  timestamp: Date;
  negationType?: string; // Type of negation detected
}

export interface SourceHighlight {
  text: string;
  startIndex: number;
  endIndex: number;
  extractedAs: string;
  field: keyof ProjectInfo;
}
