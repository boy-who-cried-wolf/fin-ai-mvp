from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from dotenv import load_dotenv
import os
from datetime import datetime
from src.models.financial_advisor import FinancialAdvisor
import logging
from logging.config import dictConfig
from src.config.logging import LogConfig
import asyncio

# Load environment variables
load_dotenv()

# Configure logging
dictConfig(LogConfig().dict())
logger = logging.getLogger(__name__)

# Load configuration
PORT = int(os.getenv('PORT', '8080'))  # Changed default port to 8080
HOST = os.getenv('HOST', '0.0.0.0')
DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:8000').split(',')

app = FastAPI(
    title="Financial Advisor AI",
    description="AI-powered financial advisory system for Australian users",
    version="1.0.0",
    debug=DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the financial advisor
advisor = FinancialAdvisor()

# Models
class Transaction(BaseModel):
    date: datetime
    amount: float
    category: str
    description: str

class FinancialAnalysis(BaseModel):
    tax_optimization: List[str]
    retirement_planning: List[str]
    risk_assessment: str
    confidence_score: float

class UserProfile(BaseModel):
    age: int
    annual_income: float
    super_balance: float
    emergency_fund: float
    investment_assets: float
    super_contributions: float
    work_expenses: float
    investment_diversity: int

class AnalysisRequest(BaseModel):
    transactions: List[Transaction]
    user_profile: UserProfile

# Routes
@app.get("/")
async def root():
    return {"message": "Australian Financial Adviser AI Service"}

@app.post("/analyze", response_model=Dict[str, Any])
async def analyze_finances(request: AnalysisRequest):
    """
    Analyze financial transactions and provide comprehensive advice
    """
    try:
        # Convert transactions to list of dictionaries
        transactions = [t.dict() for t in request.transactions]
        
        # Convert user profile to dictionary
        user_profile = request.user_profile.dict()
        
        # Add data time span for confidence calculation
        if transactions:
            dates = [t['date'] for t in transactions]
            user_profile['data_time_span_months'] = (max(dates) - min(dates)).days / 30
        
        # Get advice from the financial advisor
        advice = advisor.analyze_transactions(transactions, user_profile)
        
        return {
            "status": "success",
            "data": advice
        }
        
    except Exception as e:
        logger.error(f"Error analyzing finances: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "model_ready": True
    }

async def main():
    try:
        config = uvicorn.Config(
            "main:app",
            host=HOST,
            port=PORT,
            reload=DEBUG,
            log_level="info" if not DEBUG else "debug",
            loop="asyncio",
        )
        server = uvicorn.Server(config)
        await server.serve()
    except Exception as e:
        logger.error(f"Error running server: {e}")
        raise
    finally:
        logger.info("Server shutdown complete")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Shutting down gracefully...")
    except Exception as e:
        logger.error(f"Fatal error: {e}") 