import React, { useEffect } from 'react';
import Header from '../common/Header';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutProgress from './CheckoutProgress';
import { useCheckout } from '../CheckoutContext';

export default function OrderSummaryPage() {
    const navigate = useNavigate();
    const { shippingAddress, validCart, totalPrice, discountApplied, discountPercentage, discountAmount, shippingCost, finalTotal, refreshCart, cartData } = useCheckout();

    useEffect(() => {
        refreshCart();
    }, []);

    const getDiscountPercentage = (total) => {
        if (total >= 1000) return 15;
        if (total >= 500) return 10;
        if (total >= 200) return 5;
        return 0;
    };
    
    const discountPerc = getDiscountPercentage(totalPrice);
    const discountAmt = discountApplied ? (totalPrice * discountPerc / 100) : 0;
    const shipCost = totalPrice > 500 ? 0 : 100;
    const total = totalPrice - discountAmt + shipCost;

    const handleContinue = () => {
        if (!shippingAddress.name) {
            toast.error("Please add a delivery address first");
            navigate('/checkout/address');
            return;
        }
        navigate('/checkout/payment');
    };

    const handleBack = () => {
        navigate('/checkout/address');
    };

    if (!shippingAddress.name) {
        return (
            <div>
                <Header />
                <ToastContainer />
                <div className="container mx-auto mt-4 p-4">
                    <CheckoutProgress currentStep={3} />
                    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                        <p className="text-gray-600 mb-4">Please add a delivery address first</p>
                        <button 
                            onClick={() => navigate('/checkout/address')}
                            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
                        >
                            Add Address
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <ToastContainer />
            <div className="container mx-auto mt-4 p-4">
                <CheckoutProgress currentStep={3} />
                
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Side - Order Summary */}
                    <div className="lg:w-2/3">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow-sm border p-6 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-green-600 font-bold">✓</span>
                                <h2 className="text-lg font-semibold">Delivery Address</h2>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-semibold">{shippingAddress.name}</p>
                                <p className="text-gray-600 text-sm">{shippingAddress.address}</p>
                                <p className="text-gray-600 text-sm">{shippingAddress.city} - {shippingAddress.pincode}</p>
                                <p className="text-gray-500 text-sm">Phone: {shippingAddress.phone}</p>
                            </div>
                            <button 
                                onClick={() => navigate('/checkout/address')}
                                className="text-blue-600 text-sm mt-2 hover:underline"
                            >
                                Change Address
                            </button>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold mb-4">Order Summary ({validCart.length} items)</h2>
                            
                            {validCart.map((item, index) => {
                                const product = item.product;
                                const discountedPrice = discountApplied ? product.price * (1 - discountPerc / 100) : product.price;
                                return (
                                    <div key={index} className="flex gap-4 py-4 border-b last:border-b-0">
                                        <div className="w-20 h-20 flex-shrink-0">
                                            <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover rounded" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-sm">{product.title}</h3>
                                            <p className="text-gray-500 text-sm">₹{discountedPrice.toFixed(2)}</p>
                                            {discountApplied && discountPerc > 0 && (
                                                <span className="text-green-600 text-xs font-semibold">{discountPerc}% OFF</span>
                                            )}
                                            <p className="text-gray-500 text-sm mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right min-w-[80px]">
                                            <p className="font-semibold">₹{(discountedPrice * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Side - Price Details */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-4">
                            <h3 className="font-semibold text-lg mb-4">Price Details</h3>
                            
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal ({validCart.length} items)</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>
                                
                                {discountApplied && discountAmt > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({discountPerc}%)</span>
                                        <span>-₹{discountAmt.toFixed(2)}</span>
                                    </div>
                                )}
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span>{shipCost === 0 ? <span className="text-green-600">FREE</span> : `₹${shipCost}`}</span>
                                </div>
                                
                                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">Delivery Address:</span>
                                </div>
                                <p className="text-sm">{shippingAddress.name}, {shippingAddress.city}</p>
                            </div>

                            <button 
                                onClick={handleContinue}
                                className="w-full bg-blue-600 text-white py-3 rounded font-semibold mt-4 hover:bg-blue-700"
                            >
                                Continue to Payment
                            </button>
                            
                            <button 
                                onClick={handleBack}
                                className="w-full border border-gray-300 text-gray-700 py-2 rounded font-medium mt-2 hover:bg-gray-50"
                            >
                                ← Back to Address
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
