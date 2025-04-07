import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Transaction, UserProfile, FinancialAnalysis, HealthStatus } from './interfaces/financial.interface';
import { AxiosError, AxiosInstance, AxiosStatic } from 'axios';
import { FinancialAnalysisRequestDto, FinancialAnalysisResponseDto, UserProfileDto } from './dto/financial.dto';

@Injectable()
export class FinancialService {
  private readonly logger = new Logger(FinancialService.name);
  private readonly aiServiceUrl: string;
  private readonly timeout: number;
  private readonly axiosInstance: AxiosInstance;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.get<string>('aiService.url') || 'http://127.0.0.1:8080';
    this.timeout = this.configService.get<number>('aiService.timeout') || 30000;
    
    // Create a custom Axios instance that forces IPv4
    const axios = this.httpService.axiosRef as unknown as AxiosStatic;
    this.axiosInstance = axios.create({
      baseURL: this.aiServiceUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json'
      },
      // Force IPv4
      family: 4
    });

    this.logger.debug(`AI Service URL: ${this.aiServiceUrl}`);
  }

  async analyzeFinancialData(
    request: FinancialAnalysisRequestDto,
  ): Promise<FinancialAnalysisResponseDto> {
    try {
      this.logger.debug(`Sending request to AI service: ${JSON.stringify(request)}`);

      const response = await this.analyzeFinances(
        request.transactions,
        request.userProfile
      );

      // Convert the response to match the DTO, accessing the data property
      return {
        analysis: response.data.tax_optimization.join('\n'),
        recommendations: response.data.retirement_planning,
        riskScore: response.data.confidence_score
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(
          `AI service error: ${error.message}`,
          {
            url: this.aiServiceUrl,
            code: error.code,
            response: error.response?.data,
            stack: error.stack,
          }
        );
        throw new Error(
          `Failed to analyze financial data: ${error.response?.data?.message || error.message}`,
        );
      }
      this.logger.error('Unexpected error during financial analysis', error);
      throw new Error('An unexpected error occurred during financial analysis');
    }
  }

  async analyzeFinances(transactions: Transaction[], userProfile: UserProfile): Promise<FinancialAnalysis> {
    try {
      // Transform the user profile to match the AI service's expected format
      const transformedUserProfile = {
        age: userProfile.age,
        annual_income: userProfile.annual_income,
        super_balance: userProfile.super_balance,
        emergency_fund: userProfile.emergency_fund,
        investment_assets: userProfile.investment_assets,
        super_contributions: userProfile.super_contributions,
        work_expenses: userProfile.work_expenses,
        investment_diversity: userProfile.investment_diversity
      };

      const requestBody = {
        transactions,
        user_profile: transformedUserProfile
      };
      
      this.logger.debug(`Sending request body: ${JSON.stringify(requestBody)}`);
      
      const response = await this.axiosInstance.post<FinancialAnalysis>(
        '/analyze',
        requestBody
      );

      this.logger.debug(`Received response: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error calling AI service:', {
        error: error.message,
        url: this.aiServiceUrl,
        code: error.code,
        stack: error.stack,
      });
      
      if (error instanceof AxiosError) {
        this.logger.error('AI service error details:', {
          status: error.response?.status,
          data: error.response?.data,
        });
      }

      throw new Error('Failed to analyze finances. Please try again later.');
    }
  }

  async getHealth(): Promise<HealthStatus> {
    try {
      const response = await this.axiosInstance.get<HealthStatus>('/health');
      return response.data;
    } catch (error) {
      this.logger.error('Error checking AI service health:', {
        error: error.message,
        url: this.aiServiceUrl,
        code: error.code,
        stack: error.stack,
      });
      
      if (error instanceof AxiosError) {
        this.logger.error('AI service health check error details:', {
          status: error.response?.status,
          data: error.response?.data,
        });
      }

      return {
        status: 'unhealthy',
        error: error.message,
        info: {},
        details: {}
      };
    }
  }
} 