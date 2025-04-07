import axios from "axios";

export interface Transaction {
  date: string;
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

export interface FinancialAnalysisRequest {
  transactions: Transaction[];
  userProfile: UserProfile;
}

export interface FinancialAnalysisResponse {
  analysis: string;
  recommendations: string[];
  riskScore: number;
}

export interface ServiceHealthInfo {
  status: 'healthy' | 'unhealthy';
  error?: string;
  version?: string;
  model_ready?: boolean;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  version?: string;
  model_ready?: boolean;
  error?: string;
  info?: Record<string, ServiceHealthInfo>;
  details?: Record<string, ServiceHealthInfo>;
}

class FinancialApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  }

  async analyzeFinancialData(request: FinancialAnalysisRequest): Promise<FinancialAnalysisResponse> {
    console.log('Sending request to:', `${this.baseUrl}/financial/analyze`);
    console.log('Request data:', request);
    
    const response = await axios.post<FinancialAnalysisResponse>(
      `${this.baseUrl}/financial/analyze`,
      request,
      {
        validateStatus: (status) => status === 201 || status === 200
      }
    );
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return response.data;
  }

  async checkHealth(): Promise<HealthStatus> {
    try {
      const response = await axios.get<HealthStatus>(`${this.baseUrl}/health`);
      return response.data;
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        version: 'unknown',
        model_ready: false
      };
    }
  }
}

export const financialApi = new FinancialApi();
