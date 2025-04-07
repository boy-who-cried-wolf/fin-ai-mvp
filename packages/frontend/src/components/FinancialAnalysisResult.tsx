import React from "react";
import { useFinancial } from "../context/FinancialContext";

export const FinancialAnalysisResult: React.FC = () => {
  const { analysis, loading } = useFinancial();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis</h3>
        <p className="text-gray-700 whitespace-pre-line">{analysis.analysis}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
        <ul className="list-disc list-inside space-y-2">
          {analysis.recommendations.map((recommendation, index) => (
            <li key={index} className="text-gray-700">
              {recommendation}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Score</h3>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${analysis.riskScore}%` }}
            />
          </div>
          <span className="ml-4 text-gray-700">{analysis.riskScore}%</span>
        </div>
      </div>
    </div>
  );
}; 