'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem } from '../types';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupLocation: 'Main Counter',
    specialInstructions: '',
    paymentMethod: 'upi',
    estimatedPickupTime: '30'
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Get cart data from localStorage or context
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing cart:', error);
        router.push('/menu');
        return;
      }
    } else {
      router.push('/menu');
      return;
    }

    setIsLoading(false);
  }, [router]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  };

  const getTaxAmount = () => {
    return getCartTotal() * 0.05; // 5% tax
  };

  const getServiceCharge = () => {
    return 10; // Fixed service charge
  };

  const getFinalTotal = () => {
    return getCartTotal() + getTaxAmount() + getServiceCharge();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   },
      //   body: JSON.stringify({
      //     items: cart,
      //     pickupLocation: formData.pickupLocation,
      //     specialInstructions: formData.specialInstructions,
      //     paymentMethod: formData.paymentMethod,
      //     totalAmount: getFinalTotal()
      //   })
      // });

      // Mock order creation
      const orderId = `ORD-${Date.now()}`;
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Redirect to order confirmation
      router.push(`/orders/${orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/menu');
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    router.push('/menu');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">LICET Canteen</h1>
                <p className="text-sm text-gray-600">Checkout</p>
              </div>
            </div>
            <button
              onClick={goBack}
              className="text-gray-600 hover:text-black transition-colors"
            >
              ← Back to Menu
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-black text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step ? 'bg-black' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-16">
            <span className={`text-sm ${currentStep >= 1 ? 'text-black font-medium' : 'text-gray-400'}`}>
              Order Details
            </span>
            <span className={`text-sm ${currentStep >= 2 ? 'text-black font-medium' : 'text-gray-400'}`}>
              Payment
            </span>
            <span className={`text-sm ${currentStep >= 3 ? 'text-black font-medium' : 'text-gray-400'}`}>
              Confirm
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Order Details */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-black mb-6">Order Details</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Pickup Location
                    </label>
                    <select
                      value={formData.pickupLocation}
                      onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                    >
                      <option value="Main Counter">Main Counter</option>
                      <option value="North Wing">North Wing</option>
                      <option value="South Wing">South Wing</option>
                      <option value="Library Area">Library Area</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Estimated Pickup Time
                    </label>
                    <select
                      value={formData.estimatedPickupTime}
                      onChange={(e) => handleInputChange('estimatedPickupTime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      value={formData.specialInstructions}
                      onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                      placeholder="Any special requests or dietary preferences?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-black mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  {[
                    { id: 'upi', name: 'UPI Payment', icon: '📱', description: 'Pay using UPI apps like Google Pay, PhonePe' },
                    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Secure payment with your card' },
                    { id: 'wallet', name: 'Digital Wallet', icon: '👛', description: 'Pay using digital wallets' },
                    { id: 'campus_card', name: 'Campus Card', icon: '🎓', description: 'Use your student campus card' }
                  ].map((method) => (
                    <label key={method.id} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-black transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 border-2 rounded-full mr-4 flex items-center justify-center ${
                        formData.paymentMethod === method.id 
                          ? 'border-black bg-black' 
                          : 'border-gray-300'
                      }`}>
                        {formData.paymentMethod === method.id && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{method.icon}</span>
                          <div>
                            <h3 className="font-medium text-black">{method.name}</h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Order Confirmation */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-black mb-6">Order Confirmation</h2>
                
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-green-800">Ready to place your order!</h3>
                        <p className="text-sm text-green-600">Review your order details below</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pickup Location:</span>
                      <span className="text-black font-medium">{formData.pickupLocation}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estimated Pickup:</span>
                      <span className="text-black font-medium">{formData.estimatedPickupTime} minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="text-black font-medium capitalize">{formData.paymentMethod.replace('_', ' ')}</span>
                    </div>
                    {formData.specialInstructions && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Special Instructions:</span>
                        <span className="text-black font-medium">{formData.specialInstructions}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-black mb-4">Order Summary</h3>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.itemId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-black truncate">{item.item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-black">₹{item.item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-black">₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="text-black">₹{getTaxAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Charge</span>
                  <span className="text-black">₹{getServiceCharge()}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-black">Total</span>
                  <span className="text-black">₹{getFinalTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Place Order
                  </button>
                )}
                
                <button
                  onClick={goBack}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:border-black hover:text-black transition-colors"
                >
                  {currentStep === 1 ? 'Back to Menu' : 'Previous Step'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
