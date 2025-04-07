import React from "react";

interface TooltipProps {
    children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
    return (
        <div className="
            absolute bottom-full right-0 mb-2
            bg-white rounded-lg shadow-xl
            transform transition-all duration-200
            animate-fade-in
            z-50
            min-w-[200px]
            border border-gray-200
        ">
            <div className="relative">
                {children}
                <div className="
                    absolute -bottom-2 right-4
                    w-4 h-4 bg-white
                    transform rotate-45
                    border-r border-b border-gray-200
                " />
            </div>
        </div>
    );
}; 