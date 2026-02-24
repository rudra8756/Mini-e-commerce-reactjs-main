import React from 'react';
import Header from '../common/Header';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutProgress from './CheckoutProgress';
import { useCheckout } from '../CheckoutContext';
import API from '../api';

export default function PaymentPage() {
    const navigate = useNavigate();
    const { 
        shippingAddress, 
        validCart, 
        totalPrice, 
        discountApplied, 
        discountPercentage, 
        discountAmount, 
        shippingCost, 
        finalTotal,
        paymentMethod,
        setPaymentMethod,
        cardDetails,
        setCardDetails,
        upiId,
        setUpiId,
        selectedBank,
        setSelectedBank,
        setOrderId,
        refreshCart
    } = useCheckout();

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

    const banks = [
        { id: 'sbi', name: 'State Bank of India' },
        { id: 'hdfc', name: 'HDFC Bank' },
        { id: 'icici', name: 'ICICI Bank' },
        { id: 'axis', name: 'Axis Bank' },
        { id: 'kotak', name: 'Kotak Bank' },
        { id: 'yes', name: 'Yes Bank' },
    ];

    const validatePaymentDetails = () => {
        if (paymentMethod === "card") {
            if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 16) {
                toast.error("Please enter valid 16-digit card number");
                return false;
            }
            if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
                toast.error("Please enter valid expiry date (MM/YY)");
                return false;
            }
            if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
                toast.error("Please enter valid CVV");
                return false;
            }
            if (!cardDetails.nameOnCard) {
                toast.error("Please enter name on card");
                return false;
            }
        } else if (paymentMethod === "upi") {
            if (!upiId || !upiId.includes('@')) {
                toast.error("Please enter valid UPI ID (e.g., mobile@upi)");
                return false;
            }
        } else if (paymentMethod === "netbanking") {
            if (!selectedBank) {
                toast.error("Please select your bank");
                return false;
            }
        }
        return true;
    };

    const handlePlaceOrder = async () => {
        if (!shippingAddress.name) {
            toast.error("Please add a delivery address first");
            navigate('/checkout/address');
            return;
        }

        if (!validatePaymentDetails()) {
            return;
        }

        toast.info("Processing your order...");

        try {
            const userId = localStorage.getItem("USER_ID") || localStorage.getItem("GUEST_ID") || "guest";

            const orderData = {
                shippingAddress: {
                    name: shippingAddress.name,
                    phone: shippingAddress.phone,
                    street: shippingAddress.address,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    zipCode: shippingAddress.pincode,
                    country: "India"
                },
                paymentMethod: paymentMethod,
                paymentDetails: {
                    ...(paymentMethod === "card" && { last4: cardDetails.cardNumber.slice(-4) }),
                    ...(paymentMethod === "upi" && { upiId: upiId }),
                    ...(paymentMethod === "netbanking" && { bank: selectedBank })
                },
                userId: userId
            };

            const response = await API.post("/orders", orderData);
            const newOrderId = response.data?.order?._id || 'ORD-' + Date.now();
            setOrderId(newOrderId);
            
            toast.success("Order placed successfully!");
            navigate('/order-success');
        } catch (error) {
            toast.error("Failed to place order: " + (error.response?.data?.message || error.message));
        }
    };

    const handleBack = () => {
        navigate('/checkout/summary');
    };

    if (!shippingAddress.name) {
        return (
            <div>
                <Header />
                <ToastContainer />
                <div className="container mx-auto mt-4 p-4">
                    <CheckoutProgress currentStep={4} />
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
                <CheckoutProgress currentStep={4} />
                
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Side - Payment Options */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                            
                            {/* Delivery Address Summary */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <span className="font-medium text-sm">Delivery Address</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {shippingAddress.name}, {shippingAddress.address}, {shippingAddress.city} - {shippingAddress.pincode}
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="font-medium">💵 Cash on Delivery</span>
                                    </div>
                                    <span className="text-green-600 text-sm">No Extra Charges</span>
                                </label>
                                
                                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="upi"
                                            checked={paymentMethod === "upi"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="font-medium">📱 UPI</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-xs bg-blue-100 px-2 py-1 rounded">GPay</span>
                                        <span className="text-xs bg-purple-100 px-2 py-1 rounded">PhonePe</span>
                                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Paytm</span>
                                    </div>
                                </label>
                                
                                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="card"
                                            checked={paymentMethod === "card"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="font-medium">💳 Credit / Debit Card</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">Visa</span>
                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">Master</span>
                                    </div>
                                </label>
                                
                                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-blue-500 ${paymentMethod === 'netbanking' ? 'border-blue-500 bg-blue-50' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="netbanking"
                                            checked={paymentMethod === "netbanking"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="font-medium">🏦 Net Banking</span>
                                    </div>
                                </label>
                            </div>
                            
                            {/* Payment Details Forms */}
                            {paymentMethod === "card" && (
                                <div className="p-4 bg-gray-50 rounded-lg space-y-4 mt-4">
                                    <h4 className="font-semibold">Card Details</h4>
                                    <input 
                                        type="text" 
                                        placeholder="Card Number (16 digits)"
                                        className="w-full border rounded px-4 py-2 text-sm"
                                        maxLength={16}
                                        value={cardDetails.cardNumber}
                                        onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value.replace(/\D/g, '')})}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="MM/YY"
                                            className="w-full border rounded px-4 py-2 text-sm"
                                            maxLength={5}
                                            value={cardDetails.expiry}
                                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                                        />
                                        <input 
                                            type="password" 
                                            placeholder="CVV"
                                            className="w-full border rounded px-4 py-2 text-sm"
                                            maxLength={3}
                                            value={cardDetails.cvv}
                                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                                        />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Name on Card"
                                        className="w-full border rounded px-4 py-2 text-sm"
                                        value={cardDetails.nameOnCard}
                                        onChange={(e) => setCardDetails({...cardDetails, nameOnCard: e.target.value})}
                                    />
                                    <p className="text-xs text-green-600">🔒 Your payment is secure</p>
                                </div>
                            )}
                            
                            {paymentMethod === "upi" && (
                                <div className="p-4 bg-gray-50 rounded-lg space-y-3 mt-4">
                                    <h4 className="font-semibold">UPI Payment</h4>
                                    <input 
                                        type="text" 
                                        placeholder="UPI ID (e.g., mobile@upi)"
                                        className="w-full border rounded px-4 py-2 text-sm"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500">Pay using GPay, PhonePe, Paytm, etc.</p>
                                </div>
                            )}
                            
                            {paymentMethod === "netbanking" && (
                                <div className="p-4 bg-gray-50 rounded-lg space-y-3 mt-4">
                                    <h4 className="font-semibold">Select Your Bank</h4>
                                    <select 
                                        className="w-full border rounded px-4 py-2 text-sm"
                                        value={selectedBank}
                                        onChange={(e) => setSelectedBank(e.target.value)}
                                    >
                                        <option value="">Select Bank</option>
                                        {banks.map(bank => (
                                            <option key={bank.id} value={bank.id}>🏦 {bank.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            
                            {paymentMethod === "cod" && (
                                <div className="p-4 bg-green-50 rounded-lg mt-4">
                                    <p className="text-green-700 text-sm">
                                        ✅ Pay ₹{total.toFixed(2)} in cash when your order is delivered to your doorstep.
                                    </p>
                                </div>
                            )}
                            
                            <div className="flex gap-4 pt-4 mt-4">
                                <button 
                                    type="button"
                                    onClick={handleBack}
                                    className="px-6 py-2 border rounded font-medium hover:bg-gray-50"
                                >
                                    ← Back to Summary
                                </button>
                                <button 
                                    onClick={handlePlaceOrder}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
                                >
                                    Place Order - ₹{total.toFixed(2)}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Side - Order Summary */}
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
                            
                            <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                                <p>By placing this order, you agree to our Terms & Conditions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
