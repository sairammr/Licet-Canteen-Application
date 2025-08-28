'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    if (params.id) {
      setOrderId(params.id as string);
    }
  }, [params.id]);

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
                <p className="text-sm text-gray-600">Order Confirmation</p>
              </div>
            </div>
            <Link
              href="/menu"
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Order More Food
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Your order has been successfully placed and is being processed
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Order Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Order Number</span>
              <span className="font-semibold text-black">{orderId}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Order Date</span>
              <span className="font-semibold text-black">
                {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Confirmed
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Estimated Pickup</span>
              <span className="font-semibold text-black">30 minutes</span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Pickup Location</span>
              <span className="font-semibold text-black">Main Counter</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-xl font-bold text-black mb-4">What happens next?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-black">Kitchen Preparation</h4>
                <p className="text-gray-600">Our kitchen staff will start preparing your order</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-black">Real-time Updates</h4>
                <p className="text-gray-600">You'll receive notifications as your order progresses</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-black">Ready for Pickup</h4>
                <p className="text-gray-600">Collect your order from the specified counter</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/orders"
            className="flex-1 bg-black text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-200 text-center"
          >
            Track My Order
          </Link>
          
          <Link
            href="/menu"
            className="flex-1 border-2 border-black text-black py-4 px-6 rounded-xl font-semibold text-lg hover:bg-black hover:text-white transition-all duration-200 text-center"
          >
            Order More Food
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-2">
            Need help? Contact our support team
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/support" className="text-black hover:text-gray-600 transition-colors">
              Support Center
            </Link>
            <Link href="/contact" className="text-black hover:text-gray-600 transition-colors">
              Contact Us
            </Link>
            <Link href="/faq" className="text-black hover:text-gray-600 transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
