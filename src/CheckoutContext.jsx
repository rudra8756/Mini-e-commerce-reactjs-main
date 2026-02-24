import React, { createContext, useState, useContext } from 'react';
import API from './api';

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
    const [shippingAddress, setShippingAddress] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        isDefault: false
    });
    
    const [savedAddresses, setSavedAddresses] = useState([]);
    
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        expiry: "",
        cvv: "",
        nameOnCard: ""
    });
    const [upiId, setUpiId] = useState("");
    const [selectedBank, setSelectedBank] = useState("");
    
    const [cartData, setCartData] = useState(null);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [orderId, setOrderId] = useState('');

    // Calculate totals
    const getDiscountPercentage = (totalPrice) => {
        if (totalPrice >= 1000) return 15;
        if (totalPrice >= 500) return 10;
        if (totalPrice >= 200) return 5;
        return 0;
    };

    const validCart = (cartData?.products || []).filter(item => item.product);
    const totalPrice = validCart.reduce((total, item) => 
        total + (Number(item.quantity || 1) * Number(item.product?.price || 0)), 0
    );
    const discountPercentage = getDiscountPercentage(totalPrice);
    const discountAmount = discountApplied ? (totalPrice * discountPercentage / 100) : 0;
    const shippingCost = totalPrice > 500 ? 0 : 100;
    const finalTotal = totalPrice - discountAmount + shippingCost;

    const refreshCart = () => {
        let userId = localStorage.getItem("USER_ID") || localStorage.getItem("GUEST_ID") || "guest";
        API.get(`/cart?userId=${userId}`).then(res => {
            setCartData(res.data);
        }).catch(err => console.log(err));
    };

    const value = {
        // Address
        shippingAddress,
        setShippingAddress,
        savedAddresses,
        setSavedAddresses,
        
        // Payment
        paymentMethod,
        setPaymentMethod,
        cardDetails,
        setCardDetails,
        upiId,
        setUpiId,
        selectedBank,
        setSelectedBank,
        
        // Cart
        cartData,
        setCartData,
        refreshCart,
        validCart,
        
        // Discount
        discountApplied,
        setDiscountApplied,
        discountPercentage,
        discountAmount,
        
        // Totals
        totalPrice,
        shippingCost,
        finalTotal,
        
        // Order
        orderId,
        setOrderId
    };

    return (
        <CheckoutContext.Provider value={value}>
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error('useCheckout must be used within a CheckoutProvider');
    }
    return context;
}
