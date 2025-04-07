import pandas as pd
from typing import List, Dict, Any
import numpy as np
from datetime import datetime, timedelta

class DataProcessor:
    @staticmethod
    def normalize_categories(transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Normalize transaction categories to standard format"""
        category_mapping = {
            'groceries': ['woolworths', 'coles', 'aldi', 'food', 'supermarket'],
            'transport': ['uber', 'taxi', 'public transport', 'fuel'],
            'entertainment': ['netflix', 'spotify', 'cinema', 'restaurant'],
            'utilities': ['electricity', 'water', 'gas', 'internet'],
            'work': ['office supplies', 'work equipment', 'professional development'],
            'investment': ['shares', 'etf', 'stock', 'brokerage'],
            'super': ['superannuation', 'retirement'],
            'donation': ['charity', 'donation']
        }
        
        normalized_transactions = []
        for transaction in transactions:
            category = transaction['category'].lower()
            normalized_category = 'other'  # default category
            
            # Find matching category
            for standard_category, keywords in category_mapping.items():
                if any(keyword in category for keyword in keywords):
                    normalized_category = standard_category
                    break
            
            normalized_transactions.append({
                **transaction,
                'category': normalized_category
            })
        
        return normalized_transactions

    @staticmethod
    def calculate_spending_patterns(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate spending patterns and statistics"""
        df = pd.DataFrame(transactions)
        df['amount'] = pd.to_numeric(df['amount'])
        df['date'] = pd.to_datetime(df['date'])
        
        # Calculate daily spending
        daily_spending = df.groupby(df['date'].dt.date)['amount'].sum()
        
        # Calculate category-wise spending
        category_spending = df.groupby('category')['amount'].sum()
        
        # Calculate monthly trends
        monthly_trends = df.groupby(df['date'].dt.to_period('M'))['amount'].sum()
        
        return {
            'daily_spending': daily_spending.to_dict(),
            'category_spending': category_spending.to_dict(),
            'monthly_trends': monthly_trends.to_dict(),
            'total_spent': df['amount'].sum(),
            'average_daily_spend': daily_spending.mean(),
            'spending_volatility': daily_spending.std()
        }

    @staticmethod
    def detect_anomalies(transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Detect anomalous transactions using statistical methods"""
        df = pd.DataFrame(transactions)
        df['amount'] = pd.to_numeric(df['amount'])
        
        # Calculate z-scores
        mean = df['amount'].mean()
        std = df['amount'].std()
        df['z_score'] = (df['amount'] - mean) / std
        
        # Identify anomalies (transactions with z-score > 3)
        anomalies = df[abs(df['z_score']) > 3].to_dict('records')
        
        return anomalies

    @staticmethod
    def calculate_savings_rate(transactions: List[Dict[str, Any]]) -> float:
        """Calculate the savings rate from transactions"""
        df = pd.DataFrame(transactions)
        df['amount'] = pd.to_numeric(df['amount'])
        
        income = df[df['amount'] > 0]['amount'].sum()
        expenses = abs(df[df['amount'] < 0]['amount'].sum())
        
        if income == 0:
            return 0.0
        
        return (income - expenses) / income 