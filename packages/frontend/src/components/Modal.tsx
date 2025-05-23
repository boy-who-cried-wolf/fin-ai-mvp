import React, { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        console.log('Modal isOpen:', isOpen);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="
                fixed inset-0
                flex items-center justify-center
                p-4 sm:p-0
            ">
                <div className="
                    relative transform overflow-hidden
                    rounded-lg bg-white px-4 pb-4 pt-5
                    text-left shadow-xl transition-all
                    sm:my-8 sm:w-full sm:max-w-2xl sm:p-6
                    animate-modal-in
                    z-[101]
                    border-4 border-blue-500
                ">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="
                            absolute right-4 top-4
                            text-gray-400 hover:text-gray-500
                            focus:outline-none
                        "
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Title */}
                    <div className="mb-4">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            {title}
                        </h3>
                    </div>

                    {/* Content */}
                    <div className="mt-2">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}; 