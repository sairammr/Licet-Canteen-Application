'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { state, checkAuth } = useApp();
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    // Check authentication
    if (!state.isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    checkAuth();
    
    if (params.id) {
      setOrderId(params.id as string);
    }
  }, [state.isAuthenticated, params.id, router, checkAuth]);

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/orders')}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Orders</span>
            </button>
            <h1 className="text-2xl font-bold text-black">Order Confirmation</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-black mb-4">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. We're preparing your food with care.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-black mb-6">Order Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-semibold text-black">{orderId}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Status:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Pending
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Estimated Pickup:</span>
              <span className="font-semibold text-black">30 minutes</span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Pickup Location:</span>
              <span className="font-semibold text-black">Main Counter</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-blue-900">Order Confirmed</p>
                <p className="text-sm text-blue-700">Your order has been received and confirmed</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-blue-900">Kitchen Preparation</p>
                <p className="text-sm text-blue-700">Our chefs are preparing your delicious meal</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 text-sm font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-blue-900">Ready for Pickup</p>
                <p className="text-sm text-blue-700">We'll notify you when your order is ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/orders"
            className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-200 text-center block"
          >
            View All Orders
          </Link>
          
          <Link
            href="/menu"
            className="w-full border-2 border-black text-black py-4 px-6 rounded-xl font-semibold text-lg hover:bg-black hover:text-white transition-all duration-200 text-center block"
          >
            Order More Food
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Have questions about your order?
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/contact" className="text-black hover:text-gray-600 font-medium">
              Contact Support
            </Link>
            <Link href="/help" className="text-black hover:text-gray-600 font-medium">
              Help Center
            </Link>
            <Link href="/faq" className="text-black hover:text-gray-600 font-medium">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
