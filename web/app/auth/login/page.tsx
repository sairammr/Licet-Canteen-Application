'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, state } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      // Login success will automatically redirect to /menu
    } catch (error) {
      console.error('Login failed:', error);
      // Error is handled by the context
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          <h2 className="mt-6 text-3xl font-bold text-black">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your LICET Canteen account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800">{state.error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200 text-base"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200 text-base"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/auth/forgot-password" className="text-black hover:text-gray-600 font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials</h4>
            <p className="text-xs text-gray-600 mb-2">Use any email and password to test the app</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Email: demo@example.com</p>
              <p>Password: anypassword</p>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-black hover:text-gray-600 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-black hover:text-gray-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-black hover:text-gray-600">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
