import React from 'react';
import { useNavigate, useLocation } from 'react-router';

export default function CheckoutProgress({ currentStep }) {
    const navigate = useNavigate();
    const location = useLocation();
    
    const steps = [
        { number: 1, title: 'Cart', path: '/Cart' },
        { number: 2, title: 'Address', path: '/checkout/address' },
        { number: 3, title: 'Summary', path: '/checkout/summary' },
        { number: 4, title: 'Payment', path: '/checkout/payment' }
    ];

    const isCompleted = (stepNumber) => currentStep > stepNumber;
    const isCurrent = (stepNumber) => currentStep === stepNumber;

    return (
        <div className="bg-white rounded-sm shadow-sm border mb-4">
            <div className="flex items-center justify-between px-4 py-3">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        {/* Step Circle and Title */}
                        <div 
                            className={`flex items-center ${isCurrent(step.number) ? 'text-blue-600' : isCompleted(step.number) ? 'text-green-600' : 'text-gray-400'}`}
                            onClick={() => isCompleted(step.number) && navigate(step.path)}
                            style={{ cursor: isCompleted(step.number) ? 'pointer' : 'default' }}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                isCompleted(step.number) ? 'bg-green-600 text-white' : isCurrent(step.number) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                                {isCompleted(step.number) ? '✓' : step.number}
                            </div>
                            <span className="ml-2 text-sm font-medium hidden sm:inline">{step.title}</span>
                        </div>
                        
                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 sm:mx-4 ${isCompleted(step.number + 1) ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
