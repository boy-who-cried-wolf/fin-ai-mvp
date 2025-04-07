import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { FinancialAnalysisRequestDto, FinancialAnalysisResponseDto } from './dto/financial.dto';

@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Post('analyze')
  @UsePipes(new ValidationPipe({ transform: true }))
  async analyzeFinancialData(
    @Body() request: FinancialAnalysisRequestDto,
  ): Promise<FinancialAnalysisResponseDto> {
    return this.financialService.analyzeFinancialData(request);
  }
} 