import React, { useEffect, useState } from "react";
import { financialApi, HealthStatus } from "../api/financialApi";
import { Tooltip } from "./Tooltip";

export const ServiceHealth: React.FC = () => {
    const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const status = await financialApi.checkHealth();
                setHealthStatus(status);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to check health status");
            } finally {
                setLoading(false);
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "healthy":
                return "bg-green-500";
            case "unhealthy":
                return "bg-red-500";
            case "pending":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "healthy":
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case "unhealthy":
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case "pending":
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getTooltipContent = () => {
        if (!healthStatus) return null;
        
        return (
            <div className="p-2 text-sm">
                <div className="font-medium mb-2">Service Health Details</div>
                <div className="space-y-1">
                    <div className="flex items-center">
                        <span className="w-24">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(healthStatus.status)} text-white`}>
                            {healthStatus.status.toUpperCase()}
                        </span>
                    </div>
                    {healthStatus.version && (
                        <div className="flex items-center">
                            <span className="w-24">Version:</span>
                            <span className="text-gray-600">{healthStatus.version}</span>
                        </div>
                    )}
                    {healthStatus.model_ready !== undefined && (
                        <div className="flex items-center">
                            <span className="w-24">Model Ready:</span>
                            <span className={healthStatus.model_ready ? "text-green-600" : "text-red-600"}>
                                {healthStatus.model_ready ? "Yes" : "No"}
                            </span>
                        </div>
                    )}
                    {healthStatus.error && (
                        <div className="flex items-center">
                            <span className="w-24">Error:</span>
                            <span className="text-red-600">{healthStatus.error}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <div className={`
                    flex items-center justify-center
                    w-10 h-10 rounded-full
                    ${loading ? "bg-yellow-500" : healthStatus ? getStatusColor(healthStatus.status) : "bg-gray-500"}
                    text-white shadow-lg
                    transition-all duration-300
                    hover:scale-110 hover:shadow-xl
                    cursor-pointer
                `}>
                    {loading ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    ) : error ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : healthStatus ? (
                        getStatusIcon(healthStatus.status)
                    ) : null}
                </div>
                {showTooltip && healthStatus && (
                    <Tooltip>
                        {getTooltipContent()}
                    </Tooltip>
                )}
            </div>
        </div>
    );
}; 