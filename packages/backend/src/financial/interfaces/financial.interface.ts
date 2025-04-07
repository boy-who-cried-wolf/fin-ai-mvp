export interface Transaction {
  date: Date;
  amount: number;
  category: string;
  description: string;
}

export interface UserProfile {
  age: number;
  annual_income: number;
  super_balance: number;
  emergency_fund: number;
  investment_assets: number;
  super_contributions: number;
  work_expenses: number;
  investment_diversity: number;
}

export interface FinancialAnalysis {
  status: string;
  data: {
    tax_optimization: string[];
    retirement_planning: string[];
    risk_assessment: string;
    confidence_score: number;
    metrics?: {
      total_income: number;
      total_expenses: number;
      savings_rate: number;
    };
  };
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  version?: string;
  model_ready?: boolean;
  error?: string;
  info?: Record<string, any>;
  details?: Record<string, any>;
} 