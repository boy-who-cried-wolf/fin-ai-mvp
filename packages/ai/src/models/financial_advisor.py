import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from typing import List, Dict, Any, Tuple
import joblib
import os
from datetime import datetime, timedelta
import logging
import json

logger = logging.getLogger(__name__)

class FinancialAdvisor:
    def __init__(self, model_path: str = None):
        self.model_path = model_path or os.getenv('MODEL_PATH', './models/financial_advisor')
        
        # Initialize ML models
        self._init_ml_models()
        
        # Load Australian financial regulations
        self._load_financial_regulations()
        
        # Initialize rule-based systems
        self._init_rule_based_systems()
        
        # Load models if they exist
        self._load_models_if_exist()

    def _init_ml_models(self):
        """Initialize machine learning models for different tasks"""
        # Spending Pattern Classifier
        self.spending_classifier = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            random_state=42
        )
        
        # Savings Behavior Predictor
        self.savings_predictor = GradientBoostingRegressor(
            n_estimators=100,
            max_depth=5,
            random_state=42
        )
        
        # Risk Assessment Model
        self.risk_assessor = RandomForestClassifier(
            n_estimators=150,
            max_depth=10,
            random_state=42
        )
        
        # Tax Optimization Model
        self.tax_optimizer = GradientBoostingRegressor(
            n_estimators=100,
            max_depth=5,
            random_state=42
        )

    def _load_financial_regulations(self):
        """Load Australian financial regulations and rules"""
        self.regulations = {
            'tax': {
                'income_tax_brackets': [
                    {'min': 0, 'max': 18200, 'rate': 0.0},
                    {'min': 18201, 'max': 45000, 'rate': 0.19},
                    {'min': 45001, 'max': 120000, 'rate': 0.325},
                    {'min': 120001, 'max': 180000, 'rate': 0.37},
                    {'min': 180001, 'max': float('inf'), 'rate': 0.45}
                ],
                'medicare_levy': 0.02,
                'medicare_levy_surcharge': {
                    'single': 90000,
                    'family': 180000
                },
                'super_contribution_cap': 27500,
                'work_related_expenses': {
                    'threshold': 300,
                    'documentation_required': True
                }
            },
            'superannuation': {
                'minimum_contribution': 0.105,  # 10.5% from July 2023
                'preservation_age': 60,
                'contribution_types': {
                    'concessional': 27500,
                    'non_concessional': 110000
                }
            },
            'retirement': {
                'pension_age': 67,
                'minimum_drawdown_rates': {
                    'under_65': 0.04,
                    '65-74': 0.05,
                    '75-79': 0.06,
                    '80-84': 0.07,
                    '85-89': 0.09,
                    '90-94': 0.11,
                    '95+': 0.14
                }
            }
        }

    def _init_rule_based_systems(self):
        """Initialize rule-based systems for financial advice"""
        self.rules = {
            'tax_optimization': [
                {
                    'condition': lambda data: data['super_contributions'] < self.regulations['tax']['super_contribution_cap'],
                    'advice': "Consider salary sacrificing to maximize super contributions up to the cap"
                },
                {
                    'condition': lambda data: data['work_expenses'] > self.regulations['tax']['work_related_expenses']['threshold'],
                    'advice': "Keep detailed records of work-related expenses for tax deductions"
                }
            ],
            'retirement_planning': [
                {
                    'condition': lambda data: data['savings_rate'] < 0.15,
                    'advice': "Aim to save at least 15% of income for retirement"
                },
                {
                    'condition': lambda data: data['super_balance'] < data['annual_income'] * 5,
                    'advice': "Consider increasing super contributions to build retirement savings"
                }
            ],
            'investment_strategy': [
                {
                    'condition': lambda data: data['investment_diversity'] < 3,
                    'advice': "Diversify investments across different asset classes"
                },
                {
                    'condition': lambda data: data['emergency_fund'] < 3,
                    'advice': "Build an emergency fund covering 3-6 months of expenses"
                }
            ]
        }

    def analyze_transactions(self, transactions: List[Dict[str, Any]], user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze financial transactions and provide comprehensive advice
        """
        try:
            # Calculate basic metrics
            total_income = sum(t['amount'] for t in transactions if t['amount'] > 0)
            total_expenses = abs(sum(t['amount'] for t in transactions if t['amount'] < 0))
            savings_rate = (total_income - total_expenses) / total_income if total_income > 0 else 0

            # Generate tax optimization advice
            tax_advice = self._generate_tax_advice(user_profile, total_income)

            # Generate retirement planning advice
            retirement_advice = self._generate_retirement_advice(user_profile, savings_rate)

            # Generate risk assessment
            risk_assessment = self._assess_risk(user_profile, transactions)

            # Calculate confidence score
            confidence_score = self._calculate_confidence_score(transactions, user_profile)

            return {
                "tax_optimization": tax_advice,
                "retirement_planning": retirement_advice,
                "risk_assessment": risk_assessment,
                "confidence_score": confidence_score,
                "metrics": {
                    "total_income": total_income,
                    "total_expenses": total_expenses,
                    "savings_rate": savings_rate
                }
            }

        except Exception as e:
            self.logger.error(f"Error in analyze_transactions: {str(e)}")
            raise

    def _generate_tax_advice(self, user_profile: Dict[str, Any], total_income: float) -> List[str]:
        """Generate tax optimization advice based on user profile and income"""
        advice = []
        
        # Check super contributions
        if user_profile.get('super_contributions', 0) < 27500:
            advice.append("Consider maximizing your concessional super contributions to reduce taxable income")
        
        # Check work-related expenses
        if user_profile.get('work_expenses', 0) > 0:
            advice.append("Ensure you're claiming all eligible work-related expenses")
        
        # Check investment income
        if user_profile.get('investment_assets', 0) > 0:
            advice.append("Consider tax-efficient investment strategies like franking credits")
        
        return advice

    def _generate_retirement_advice(self, user_profile: Dict[str, Any], savings_rate: float) -> List[str]:
        """Generate retirement planning advice"""
        advice = []
        
        # Check super balance
        if user_profile.get('super_balance', 0) < 100000:
            advice.append("Consider increasing your super contributions to build your retirement savings")
        
        # Check savings rate
        if savings_rate < 0.2:
            advice.append("Your savings rate is below recommended levels. Consider increasing your savings")
        
        # Check emergency fund
        if user_profile.get('emergency_fund', 0) < user_profile.get('annual_income', 0) / 12 * 3:
            advice.append("Build an emergency fund of at least 3 months' expenses")
        
        return advice

    def _assess_risk(self, user_profile: Dict[str, Any], transactions: List[Dict[str, Any]]) -> str:
        """Assess financial risk based on user profile and transactions"""
        # Calculate income volatility
        income_transactions = [t['amount'] for t in transactions if t['amount'] > 0]
        income_volatility = np.std(income_transactions) if income_transactions else 0
        
        # Calculate expense volatility
        expense_transactions = [abs(t['amount']) for t in transactions if t['amount'] < 0]
        expense_volatility = np.std(expense_transactions) if expense_transactions else 0
        
        # Assess risk level
        if income_volatility > 0.3 or expense_volatility > 0.3:
            return "High risk: Significant income or expense volatility detected"
        elif user_profile.get('emergency_fund', 0) < user_profile.get('annual_income', 0) / 12:
            return "Medium risk: Insufficient emergency fund"
        else:
            return "Low risk: Stable financial situation"

    def _calculate_confidence_score(self, transactions: List[Dict[str, Any]], user_profile: Dict[str, Any]) -> float:
        """Calculate confidence score based on data quality and completeness"""
        score = 0.0
        
        # Data time span
        if 'data_time_span_months' in user_profile:
            if user_profile['data_time_span_months'] >= 12:
                score += 0.4
            elif user_profile['data_time_span_months'] >= 6:
                score += 0.3
            elif user_profile['data_time_span_months'] >= 3:
                score += 0.2
            else:
                score += 0.1
        
        # Transaction count
        if len(transactions) >= 100:
            score += 0.3
        elif len(transactions) >= 50:
            score += 0.2
        elif len(transactions) >= 20:
            score += 0.1
        
        # Profile completeness
        required_fields = ['age', 'annual_income', 'super_balance', 'emergency_fund']
        complete_fields = sum(1 for field in required_fields if field in user_profile and user_profile[field] is not None)
        score += (complete_fields / len(required_fields)) * 0.3
        
        return min(1.0, score)

    def save_models(self):
        """Save the trained models and configuration"""
        os.makedirs(self.model_path, exist_ok=True)
        
        # Save ML models
        joblib.dump(self.spending_classifier, os.path.join(self.model_path, 'spending_classifier.joblib'))
        joblib.dump(self.savings_predictor, os.path.join(self.model_path, 'savings_predictor.joblib'))
        joblib.dump(self.risk_assessor, os.path.join(self.model_path, 'risk_assessor.joblib'))
        joblib.dump(self.tax_optimizer, os.path.join(self.model_path, 'tax_optimizer.joblib'))
        
        # Save regulations and rules
        with open(os.path.join(self.model_path, 'regulations.json'), 'w') as f:
            json.dump(self.regulations, f)
        
        with open(os.path.join(self.model_path, 'rules.json'), 'w') as f:
            json.dump(self.rules, f)

    def _load_models_if_exist(self):
        """Load saved models if they exist in the model path"""
        try:
            if os.path.exists(self.model_path):
                self.spending_classifier = joblib.load(os.path.join(self.model_path, 'spending_classifier.joblib'))
                self.savings_predictor = joblib.load(os.path.join(self.model_path, 'savings_predictor.joblib'))
                self.risk_assessor = joblib.load(os.path.join(self.model_path, 'risk_assessor.joblib'))
                self.tax_optimizer = joblib.load(os.path.join(self.model_path, 'tax_optimizer.joblib'))
                logger.info("Successfully loaded saved models")
        except Exception as e:
            logger.warning(f"Could not load saved models: {str(e)}")
            logger.info("Using newly initialized models instead") 