'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from './context/AppContext';

export default function LandingPage() {
  const router = useRouter();
  const { state, checkAuth } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    setIsLoading(false);
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && state.isAuthenticated) {
      router.push('/menu');
    }
  }, [isLoading, state.isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-2xl font-bold text-black">LICET Canteen</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/auth/login')}
                className="px-6 py-3 border-2 border-black text-black font-medium rounded-lg hover:bg-black hover:text-white transition-all duration-200"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Order Delicious Food
            <span className="block text-gray-600">From LICET Canteen</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Skip the queue and order your favorite meals online. Get real-time updates, 
            secure payments, and enjoy fresh food delivered to your pickup location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-8 py-4 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-8 py-4 border-2 border-black text-black text-lg font-semibold rounded-xl hover:bg-black hover:text-white transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-black text-center mb-16">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Fast & Convenient</h3>
              <p className="text-gray-600">
                Order in seconds, skip the queue, and pick up your food when it's ready.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Real-time Tracking</h3>
              <p className="text-gray-600">
                Get live updates on your order status from preparation to pickup.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Secure Payments</h3>
              <p className="text-gray-600">
                Multiple payment options including UPI, cards, and digital wallets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Order?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already enjoying the convenience of online food ordering.
          </p>
          <button
            onClick={() => router.push('/auth/signup')}
            className="px-8 py-4 bg-white text-black text-lg font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            Create Account Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-lg font-semibold text-black">LICET Canteen</span>
          </div>
          <p className="text-gray-600 mb-4">
            Making campus dining easier, one order at a time.
          </p>
          <div className="text-sm text-gray-500">
            © 2024 LICET Canteen. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
