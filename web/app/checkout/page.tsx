'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, placeOrder, checkAuth, getCartTotal } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupLocation: 'Main Counter',
    specialInstructions: '',
    paymentMethod: 'upi' as PaymentMethod,
    estimatedPickupTime: '30'
  });

  useEffect(() => {
    // Check authentication
    if (!state.isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Check if cart has items
    if (state.cart.length === 0) {
      router.push('/menu');
      return;
    }

    checkAuth();
    setIsLoading(false);
  }, [state.isAuthenticated, state.cart.length, router, checkAuth]);

  const getTaxAmount = () => {
    return getCartTotal() * 0.05; // 5% tax
  };

  const getServiceCharge = () => {
    return getCartTotal() * 0.02; // 2% service charge
  };

  const getFinalTotal = () => {
    return getCartTotal() + getTaxAmount() + getServiceCharge();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (state.cart.length === 0) return;

    try {
      const order = await placeOrder({
        pickupLocation: formData.pickupLocation,
        specialInstructions: formData.specialInstructions,
        paymentMethod: formData.paymentMethod,
        estimatedPickupTime: new Date(Date.now() + parseInt(formData.estimatedPickupTime) * 60 * 1000)
      });

      // Redirect to order confirmation
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      // You can show an error message here
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (state.cart.length === 0) {
    return null; // Will redirect to menu
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-black">Checkout</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  step <= currentStep
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-black' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-16">
            <span className={`text-sm ${currentStep >= 1 ? 'text-black font-medium' : 'text-gray-500'}`}>
              Pickup Details
            </span>
            <span className={`text-sm ${currentStep >= 2 ? 'text-black font-medium' : 'text-gray-500'}`}>
              Special Instructions
            </span>
            <span className={`text-sm ${currentStep >= 3 ? 'text-black font-medium' : 'text-gray-500'}`}>
              Payment
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Steps */}
          <div className="lg:col-span-2">
            {/* Step 1: Pickup Details */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-6">Pickup Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Location
                    </label>
                    <select
                      value={formData.pickupLocation}
                      onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200"
                    >
                      <option value="Main Counter">Main Counter</option>
                      <option value="North Gate">North Gate</option>
                      <option value="South Gate">South Gate</option>
                      <option value="East Gate">East Gate</option>
                      <option value="West Gate">West Gate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Pickup Time
                    </label>
                    <select
                      value={formData.estimatedPickupTime}
                      onChange={(e) => handleInputChange('estimatedPickupTime', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Special Instructions */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-6">Special Instructions</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      value={formData.specialInstructions}
                      onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                      placeholder="Any special requests or dietary requirements..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200 resize-none"
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      💡 Tip: You can specify cooking preferences, allergies, or any other special requirements here.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-black mb-6">Payment Method</h2>
                <div className="space-y-4">
                  {[
                    { value: 'upi', label: 'UPI', icon: '📱', description: 'Pay using UPI apps like Google Pay, PhonePe' },
                    { value: 'card', label: 'Credit/Debit Card', icon: '💳', description: 'Secure payment with your card' },
                    { value: 'wallet', label: 'Digital Wallet', icon: '👛', description: 'Pay using digital wallets' },
                    { value: 'campus_card', label: 'Campus Card', icon: '🆔', description: 'Use your student ID card' }
                  ].map((method) => (
                    <label key={method.value} className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-black transition-all duration-200">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 ${
                        formData.paymentMethod === method.value
                          ? 'border-black bg-black'
                          : 'border-gray-300'
                      }`}>
                        {formData.paymentMethod === method.value && (
                          <div className="w-2 h-2 bg-white rounded-full m-auto"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <h3 className="font-semibold text-black">{method.label}</h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={goBack}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-black hover:text-black transition-all duration-200"
              >
                {currentStep === 1 ? 'Back to Menu' : 'Previous'}
              </button>
              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={state.isLoading}
                  className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {state.isLoading ? 'Placing Order...' : 'Place Order'}
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-24">
              <h3 className="text-xl font-bold text-black mb-6">Order Summary</h3>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {state.cart.map((item) => (
                  <div key={item.itemId} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex-1">
                      <p className="font-medium text-black">{item.item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-black">₹{item.item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-black">₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (5%):</span>
                  <span className="text-black">₹{getTaxAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Charge (2%):</span>
                  <span className="text-black">₹{getServiceCharge().toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-black">Total:</span>
                    <span className="text-black">₹{getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Pickup Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-black mb-2">Pickup Information</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Location:</strong> {formData.pickupLocation}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> {formData.estimatedPickupTime} minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
