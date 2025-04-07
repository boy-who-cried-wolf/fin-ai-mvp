import React, { createContext, useContext, useState, useCallback } from "react";
import {
  financialApi,
  FinancialAnalysisRequest,
  FinancialAnalysisResponse,
} from "../api/financialApi";

interface FinancialContextType {
  analysis: FinancialAnalysisResponse | null;
  loading: boolean;
  error: string | null;
  analyzeFinancialData: (request: FinancialAnalysisRequest) => Promise<void>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(
  undefined,
);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [analysis, setAnalysis] = useState<FinancialAnalysisResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeFinancialData = useCallback(
    async (request: FinancialAnalysisRequest) => {
      try {
        setLoading(true);
        setError(null);
        const result = await financialApi.analyzeFinancialData(request);
        setAnalysis(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return (
    <FinancialContext.Provider
      value={{
        analysis,
        loading,
        error,
        analyzeFinancialData,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error("useFinancial must be used within a FinancialProvider");
  }
  return context;
}; 