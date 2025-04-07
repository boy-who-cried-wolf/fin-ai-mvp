# Australian Financial Adviser AI

An AI-powered financial advisory system that analyzes transaction data, applies Australian financial laws, and generates tax optimization and retirement planning strategies.

## Project Structure

The project is divided into three main components:

1. **AI/ML Model** (`packages/ai`) - Trained on Australian financial regulations
2. **Backend** (`packages/backend`) - NestJS application handling data processing and API
3. **Frontend** (`packages/frontend`) - React + TypeScript + TailwindCSS interface

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Python 3.9+ (for AI/ML component)
- Docker (optional, for development)

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in each package directory
   - Fill in the required environment variables

3. Start development servers:
   ```bash
   # Start all components
   pnpm run dev:frontend
   pnpm run dev:backend
   pnpm run dev:ai
   ```

## Development

Each package has its own development setup and documentation. Please refer to the respective package's README for more details.

## License

MIT 