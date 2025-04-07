import React, { useState, useEffect } from "react";
import { useFinancial } from "../context/FinancialContext";
import { Modal } from "./Modal";
import { LoadingSpinner } from "./LoadingSpinner";
import { mockTransactions } from "../mocks/transactions";
import { Transaction } from "../api/financialApi";

interface UserProfile {
  age: number;
  annual_income: number;
  super_balance: number;
  emergency_fund: number;
  investment_assets: number;
  super_contributions: number;
  work_expenses: number;
  investment_diversity: number;
}

interface FinancialAnalysis {
  savings_rate: number;
  retirement_savings_projection: number;
  risk_score: number;
  confidence_score: number;
  financial_health_score: number;
  recommendations: string[];
}

export const FinancialAnalysis: React.FC = () => {
  const { analysis, loading, error, analyzeFinancialData } = useFinancial();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: 30,
    annual_income: 80000,
    super_balance: 50000,
    emergency_fund: 10000,
    investment_assets: 20000,
    super_contributions: 5000,
    work_expenses: 5000,
    investment_diversity: 3
  });

  useEffect(() => {
    setTransactions(mockTransactions);
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsModalOpen(true);
      await analyzeFinancialData({ transactions, userProfile });
    } catch (err) {
      console.error("Analysis failed:", err);
    }
  };

  const addTransaction = () => {
    setTransactions([
      ...transactions,
      {
        date: new Date().toISOString().split("T")[0],
        amount: 0,
        category: "",
        description: "",
      },
    ]);
  };

  const updateTransaction = (index: number, field: keyof Transaction, value: string | number) => {
    const newTransactions = [...transactions];
    newTransactions[index] = {
      ...newTransactions[index],
      [field]: value,
    };
    setTransactions(newTransactions);
  };

  const updateUserProfile = (field: keyof UserProfile, value: number) => {
    setUserProfile({
      ...userProfile,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAnalyze} className="space-y-6">
        {/* User Profile Section */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Your Financial Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                value={userProfile.age}
                onChange={(e) => updateUserProfile("age", parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Annual Income ($)</label>
              <input
                type="number"
                value={userProfile.annual_income}
                onChange={(e) => updateUserProfile("annual_income", parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Super Balance ($)</label>
              <input
                type="number"
                value={userProfile.super_balance}
                onChange={(e) => updateUserProfile("super_balance", parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Emergency Fund ($)</label>
              <input
                type="number"
                value={userProfile.emergency_fund}
                onChange={(e) => updateUserProfile("emergency_fund", parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Investment Assets ($)</label>
              <input
                type="number"
                value={userProfile.investment_assets}
                onChange={(e) => updateUserProfile("investment_assets", parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Super Contributions ($)</label>
              <input
                type="number"
                value={userProfile.super_contributions}
                onChange={(e) => updateUserProfile("super_contributions", parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Work Expenses ($)</label>
              <input
                type="number"
                value={userProfile.work_expenses}
                onChange={(e) => updateUserProfile("work_expenses", parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Investment Diversity (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={userProfile.investment_diversity}
                onChange={(e) => updateUserProfile("investment_diversity", parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Transactions</h3>
            <button
              type="button"
              onClick={addTransaction}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Transaction
            </button>
          </div>
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={transaction.date}
                    onChange={(e) => updateTransaction(index, "date", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                  <input
                    type="number"
                    value={transaction.amount}
                    onChange={(e) => updateTransaction(index, "amount", parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    value={transaction.category}
                    onChange={(e) => updateTransaction(index, "category", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={transaction.description}
                    onChange={(e) => updateTransaction(index, "description", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            px-4 py-2
            bg-blue-500 text-white
            rounded-lg
            hover:bg-blue-600
            disabled:bg-gray-400
            transition-colors duration-200
            shadow-md hover:shadow-lg
            disabled:cursor-not-allowed
            flex items-center justify-center
            min-w-[150px]
          "
        >
          {loading ? (
            <LoadingSpinner size="sm" color="text-white" />
          ) : (
            "Analyze Finances"
          )}
        </button>
      </form>

      {error && !isModalOpen && (
        <div className="text-red-600">
          {error}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Financial Analysis Results"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Analyzing your financial data...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Analysis</h4>
              <p className="text-gray-900 whitespace-pre-line">{analysis.analysis}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Recommendations</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="text-gray-900">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Risk Score</h4>
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(analysis.riskScore * 100).toFixed(1)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{(analysis.riskScore * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}; 