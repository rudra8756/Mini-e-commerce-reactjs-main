import React from 'react';
import Header from '../common/Header';
import { useNavigate } from 'react-router';
import { useCheckout } from '../CheckoutContext';
import API from '../api';

export default function OrderSuccess() {
    const navigate = useNavigate();
    const { orderId, validCart } = useCheckout();

    const handleContinueShopping = () => {
        navigate('/');
    };

    const displayOrderId = orderId || 'ORD-' + Date.now();

    return (
        <div>
            <Header />
            <div className="container mx-auto mt-10 p-4">
                <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm border p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl text-green-600">✓</span>
                    </div>
                    
                    <h2 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-6">Thank you for your order</p>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="text-xl font-bold text-blue-600">{displayOrderId}</p>
                    </div>
                    
                    <div className="text-left space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-green-600">✓</span>
                            <span className="text-sm">Payment {orderId ? 'received' : 'processing'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-green-600">✓</span>
                            <span className="text-sm">Order confirmed</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-green-600">✓</span>
                            <span className="text-sm">Estimated delivery: 5-7 business days</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleContinueShopping}
                        className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
