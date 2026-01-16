export interface CalculationResult {
  raw: number;
  formatted: string;
  lakhs: string;
  remainder: string;
}

export interface HistoryItem {
  id: string;
  worldPrice: number;
  exchangeRate: number;
  result: number;
  timestamp: Date;
}

export type CalculationMode = 'PRICE' | 'IMPLIED_RATE';