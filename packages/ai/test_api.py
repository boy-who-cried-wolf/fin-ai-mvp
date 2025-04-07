import requests
import json
from datetime import datetime, timedelta
import random

# API endpoint
BASE_URL = "http://localhost:8000"

def generate_sample_transactions(num_transactions=30):
    """Generate sample transaction data"""
    categories = [
        "Salary", "Investment", "Superannuation",
        "Housing", "Transport", "Food",
        "Entertainment", "Healthcare", "Education"
    ]
    
    transactions = []
    base_date = datetime.now() - timedelta(days=90)
    
    for _ in range(num_transactions):
        # Generate random date within last 90 days
        date = base_date + timedelta(days=random.randint(0, 90))
        
        # Generate random amount (positive for income, negative for expenses)
        is_income = random.random() < 0.2  # 20% chance of being income
        amount = random.uniform(10, 1000) * (1 if is_income else -1)
        
        # Select random category
        category = random.choice(categories)
        
        transactions.append({
            "date": date.isoformat(),
            "amount": round(amount, 2),
            "category": category,
            "description": f"Sample {category} transaction"
        })
    
    return transactions

def generate_sample_user_profile():
    """Generate sample user profile data"""
    return {
        "age": 35,
        "annual_income": 85000,
        "super_balance": 150000,
        "emergency_fund": 20000,
        "investment_assets": 50000,
        "super_contributions": 10000,
        "work_expenses": 5000,
        "investment_diversity": 2
    }

def test_api():
    """Test the financial advisor API"""
    try:
        # Generate sample data
        transactions = generate_sample_transactions()
        user_profile = generate_sample_user_profile()
        
        # Prepare request
        request_data = {
            "transactions": transactions,
            "user_profile": user_profile
        }
        
        # Make API request
        print("Sending request to analyze finances...")
        response = requests.post(
            f"{BASE_URL}/analyze",
            json=request_data
        )
        
        # Check response
        if response.status_code == 200:
            result = response.json()
            print("\nAnalysis Results:")
            print(json.dumps(result, indent=2))
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"Error testing API: {str(e)}")

if __name__ == "__main__":
    test_api() 