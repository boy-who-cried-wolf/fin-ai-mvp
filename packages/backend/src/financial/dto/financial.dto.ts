import { IsString, IsNumber, IsDate, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsString()
  description: string;
}

export class UserProfileDto {
  @IsNumber()
  age: number;

  @IsNumber()
  annual_income: number;

  @IsNumber()
  super_balance: number;

  @IsNumber()
  emergency_fund: number;

  @IsNumber()
  investment_assets: number;

  @IsNumber()
  super_contributions: number;

  @IsNumber()
  work_expenses: number;

  @IsNumber()
  investment_diversity: number;
}

export class FinancialAnalysisRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionDto)
  transactions: TransactionDto[];

  @ValidateNested()
  @Type(() => UserProfileDto)
  userProfile: UserProfileDto;
}

export class FinancialAnalysisResponseDto {
  @IsString()
  analysis: string;

  @IsArray()
  @IsString({ each: true })
  recommendations: string[];

  @IsNumber()
  riskScore: number;
} 