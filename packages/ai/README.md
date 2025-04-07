# Financial Advisor AI Service

This service provides AI-powered financial advice for Australian users, including tax optimization, retirement planning, and risk assessment.

## Features

- Tax optimization advice based on income and super contributions
- Retirement planning recommendations
- Financial risk assessment
- Confidence scoring based on data quality
- Comprehensive financial metrics

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
HOST=0.0.0.0
DEBUG=false
LOG_LEVEL=INFO
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

## Running the Service

Development mode:
```bash
python main.py
```

Production mode:
```bash
uvicorn main:app --host 0.0.0.0 --port 5000
```

## API Endpoints

### POST /analyze
Analyze financial transactions and provide comprehensive advice.

Request body:
```json
{
  "transactions": [
    {
      "date": "2023-01-01T00:00:00",
      "amount": 1000.00,
      "category": "salary",
      "description": "Monthly salary"
    }
  ],
  "user_profile": {
    "age": 30,
    "annual_income": 100000.00,
    "super_balance": 50000.00,
    "emergency_fund": 20000.00,
    "investment_assets": 30000.00,
    "super_contributions": 25000.00,
    "work_expenses": 5000.00,
    "investment_diversity": 3
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "tax_optimization": [
      "Consider maximizing your concessional super contributions to reduce taxable income"
    ],
    "retirement_planning": [
      "Consider increasing your super contributions to build your retirement savings"
    ],
    "risk_assessment": "Low risk: Stable financial situation",
    "confidence_score": 0.85,
    "metrics": {
      "total_income": 1000.00,
      "total_expenses": 0.00,
      "savings_rate": 1.00
    }
  }
}
```

### GET /health
Health check endpoint.

Response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "model_ready": true
}
```

## Project Structure

```
ai/
├── src/
│   ├── config/
│   │   └── logging.py
│   └── models/
│       └── financial_advisor.py
├── main.py
├── requirements.txt
├── .env.example
└── README.md
```

## Development

1. Install development dependencies:
```bash
pip install -r requirements-dev.txt
```

2. Run tests:
```bash
pytest
```

3. Run linting:
```bash
flake8
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT 