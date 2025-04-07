import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Transaction, UserProfile, FinancialAnalysis, HealthStatus } from './interfaces/financial.interface';
export declare class FinancialService {
    private readonly httpService;
    private readonly configService;
    private readonly AI_SERVICE_URL;
    constructor(httpService: HttpService, configService: ConfigService);
    analyzeFinances(transactions: Transaction[], userProfile: UserProfile): Promise<FinancialAnalysis>;
    getHealth(): Promise<HealthStatus>;
}
