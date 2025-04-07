import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class AnalyzeFinancesDto {
  @IsNumber()
  @IsNotEmpty()
  income: number;

  @IsNumber()
  @IsNotEmpty()
  expenses: number;

  @IsNumber()
  @IsNotEmpty()
  savings: number;

  @IsString()
  @IsNotEmpty()
  goals: string;
} 