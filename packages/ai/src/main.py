from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from dotenv import load_dotenv
import os
import logging
from services.analysis_service import AnalysisService
from utils.data_processor import DataProcessor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Australian Financial Adviser AI",
    description="AI service for financial advice and analysis",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
analysis_service = AnalysisService()
data_processor = DataProcessor()

# Models
class Transaction(BaseModel):
    amount: float
    category: str
    date: str
    merchant: str

class FinancialAnalysis(BaseModel):
    tax_optimization: List[str]
    retirement_planning: List[str]
    risk_assessment: str
    confidence_score: float
    spending_patterns: Optional[dict] = None
    anomalies: Optional[List[dict]] = None
    savings_rate: Optional[float] = None

# Routes
@app.get("/")
async def root():
    return {"message": "Australian Financial Adviser AI Service"}

@app.post("/analyze", response_model=FinancialAnalysis)
async def analyze_transactions(transactions: List[Transaction]):
    try:
        # Convert Pydantic models to dictionaries
        transaction_dicts = [t.dict() for t in transactions]
        
        # Normalize categories
        normalized_transactions = data_processor.normalize_categories(transaction_dicts)
        
        # Get analysis from the service
        analysis = await analysis_service.analyze_transactions(normalized_transactions)
        
        # Add additional insights
        analysis['spending_patterns'] = data_processor.calculate_spending_patterns(normalized_transactions)
        analysis['anomalies'] = data_processor.detect_anomalies(normalized_transactions)
        analysis['savings_rate'] = data_processor.calculate_savings_rate(normalized_transactions)
        
        return analysis
        
    except Exception as e:
        logger.error(f"Error in transaction analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        reload=True
    ) 