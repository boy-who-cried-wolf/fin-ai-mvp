export interface Transaction {
    date: string;
    amount: number;
    category: string;
    description: string;
}
export interface UserProfile {
    age: number;
    income: number;
    occupation: string;
    risk_tolerance: 'low' | 'medium' | 'high';
    financial_goals: string[];
}
export interface FinancialAnalysis {
    savings_rate: number;
    retirement_savings_projection: number;
    risk_score: number;
    confidence_score: number;
    financial_health_score: number;
    recommendations: string[];
}
export interface HealthStatus {
    status: string;
}
