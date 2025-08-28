'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { signup, state } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (state.isAuthenticated) {
      router.push('/menu');
    }
  }, [state.isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      // Validate first step
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.studentId) {
        return;
      }
      setStep(2);
    } else {
      // Validate second step
      if (!formData.password || !formData.confirmPassword) {
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        return;
      }
      if (formData.password.length < 8) {
        return;
      }
      if (!formData.agreeToTerms) {
        return;
      }

      // Submit registration
      setIsLoading(true);
      try {
        await signup(formData);
        // Signup success will automatically redirect to /menu
      } catch (error) {
        console.error('Registration failed:', error);
        // Error is handled by the context
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-black">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join LICET Canteen and start ordering delicious food
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 ${
            step >= 2 ? 'bg-black' : 'bg-gray-200'
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800">{state.error}</p>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID *
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200"
                    placeholder="Enter your student ID"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Account Security */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200"
                    placeholder="Create a password"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200"
                    placeholder="Confirm your password"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    required
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-black hover:text-gray-600 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-black hover:text-gray-600 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={goBack}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-black hover:text-black transition-all duration-200"
              >
                {step === 1 ? 'Back to Login' : 'Previous'}
              </button>
              
              {step === 1 ? (
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-black hover:text-gray-600 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our terms and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}
