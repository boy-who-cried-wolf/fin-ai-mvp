import { ErrorBoundary } from "./components/ErrorBoundary";
import { FinancialAnalysis } from "./components/FinancialAnalysis";
import { ServiceHealth } from "./components/ServiceHealth";
import { FinancialProvider } from "./context/FinancialContext";

function App() {
  return (
    <ErrorBoundary>
      <FinancialProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Financial Analysis AI
              </h1>
              <div className="mb-6">
                <ServiceHealth />
              </div>
              <FinancialAnalysis />
            </div>
          </div>
        </div>
      </FinancialProvider>
    </ErrorBoundary>
  );
}

export default App; 