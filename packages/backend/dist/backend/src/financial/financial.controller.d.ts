import { FinancialService } from './financial.service';
import { Transaction, UserProfile, FinancialAnalysis, HealthStatus } from './interfaces/financial.interface';
export declare class FinancialController {
    private readonly financialService;
    constructor(financialService: FinancialService);
    analyzeFinances(transactions: Transaction[], userProfile: UserProfile): Promise<FinancialAnalysis>;
    getHealth(): Promise<HealthStatus>;
}
