export interface Question {
  id: number;
  category: string;
  questionText: string;
  options: {
    id: string;
    text: string;
    archetypeClue?: string; // Information to help guide or explain
  }[];
}

export interface Answer {
  questionId: number;
  selectedOptionId: string;
  selectedOptionText: string;
  customDetails?: string;
}

export interface AnalysisResult {
  rawResponse: string;
  profileHtml?: string; // formatted summary
  error?: string;
}
