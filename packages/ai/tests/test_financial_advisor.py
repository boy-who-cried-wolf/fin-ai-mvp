import pytest
from datetime import datetime
from src.models.financial_advisor import FinancialAdvisor

@pytest.fixture
def advisor():
    return FinancialAdvisor()

@pytest.fixture
def sample_transactions():
    return [
        {
            "date": datetime(2023, 1, 1),
            "amount": 5000.00,
            "category": "salary",
            "description": "Monthly salary"
        },
        {
            "date": datetime(2023, 1, 15),
            "amount": -2000.00,
            "category": "rent",
            "description": "Monthly rent"
        }
    ]

@pytest.fixture
def sample_user_profile():
    return {
        "age": 30,
        "annual_income": 100000.00,
        "super_balance": 50000.00,
        "emergency_fund": 20000.00,
        "investment_assets": 30000.00,
        "super_contributions": 25000.00,
        "work_expenses": 5000.00,
        "investment_diversity": 3
    }

def test_analyze_transactions(advisor, sample_transactions, sample_user_profile):
    result = advisor.analyze_transactions(sample_transactions, sample_user_profile)
    
    assert "tax_optimization" in result
    assert "retirement_planning" in result
    assert "risk_assessment" in result
    assert "confidence_score" in result
    assert "metrics" in result
    
    assert isinstance(result["tax_optimization"], list)
    assert isinstance(result["retirement_planning"], list)
    assert isinstance(result["risk_assessment"], str)
    assert isinstance(result["confidence_score"], float)
    assert isinstance(result["metrics"], dict)

def test_generate_tax_advice(advisor, sample_user_profile):
    advice = advisor._generate_tax_advice(sample_user_profile, 100000.00)
    assert isinstance(advice, list)
    assert len(advice) > 0

def test_generate_retirement_advice(advisor, sample_user_profile):
    advice = advisor._generate_retirement_advice(sample_user_profile, 0.2)
    assert isinstance(advice, list)
    assert len(advice) > 0

def test_assess_risk(advisor, sample_transactions, sample_user_profile):
    risk = advisor._assess_risk(sample_user_profile, sample_transactions)
    assert isinstance(risk, str)
    assert risk in ["High risk: Significant income or expense volatility detected",
                   "Medium risk: Insufficient emergency fund",
                   "Low risk: Stable financial situation"]

def test_calculate_confidence_score(advisor, sample_transactions, sample_user_profile):
    score = advisor._calculate_confidence_score(sample_transactions, sample_user_profile)
    assert isinstance(score, float)
    assert 0 <= score <= 1.0

def test_analyze_transactions_empty_data(advisor):
    result = advisor.analyze_transactions([], {})
    assert result["confidence_score"] < 0.5  # Should have low confidence with empty data

def test_analyze_transactions_invalid_data(advisor):
    with pytest.raises(Exception):
        advisor.analyze_transactions(None, None) 