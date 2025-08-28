'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

export default function OrderHistoryPage() {
  const router = useRouter();
  const { state, checkAuth } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    // Check authentication
    if (!state.isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    checkAuth();
  }, [state.isAuthenticated, router, checkAuth]);

  const filteredOrders = selectedFilter === 'all' 
    ? state.orders 
    : state.orders.filter(order => order.status === selectedFilter);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case OrderStatus.CONFIRMED:
        return 'bg-green-100 text-green-800 border-green-200';
      case OrderStatus.IN_PROGRESS:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case OrderStatus.READY_FOR_PICKUP:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case OrderStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return '📝';
      case OrderStatus.CONFIRMED:
        return '✅';
      case OrderStatus.IN_PROGRESS:
        return '👨‍🍳';
      case OrderStatus.READY_FOR_PICKUP:
        return '🎉';
      case OrderStatus.COMPLETED:
        return '🎊';
      case OrderStatus.CANCELLED:
        return '❌';
      default:
        return '📋';
    }
  };

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">Order History</h1>
              <p className="text-gray-600 mt-1">Track and manage your food orders</p>
            </div>
            <button
              onClick={() => router.push('/menu')}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Order Food
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                selectedFilter === 'all'
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 bg-white text-black hover:border-black'
              }`}
            >
              All Orders ({state.orders.length})
            </button>
            {Object.values(OrderStatus).map((status) => {
              const count = state.orders.filter(order => order.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedFilter(status)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                    selectedFilter === status
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-black hover:border-black'
                  }`}
                >
                  {getStatusIcon(status)} {status.replace('_', ' ')} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-4">
                {selectedFilter === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `No orders with status "${selectedFilter.replace('_', ' ')}" found.`
                }
              </p>
              {selectedFilter !== 'all' && (
                <button
                  onClick={() => setSelectedFilter('all')}
                  className="text-black underline hover:text-gray-600"
                >
                  View all orders
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-black">Order #{order.orderNumber}</h3>
                      <p className="text-gray-600">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-black">{item.item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium text-black">₹{item.item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          Pickup: {order.pickupLocation}
                        </p>
                        {order.status === OrderStatus.IN_PROGRESS && (
                          <p className="text-sm text-orange-600">
                            Estimated pickup: {new Date(order.estimatedPickupTime).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-black">Total: ₹{order.totalAmount}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {order.paymentStatus} • {order.paymentMethod || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="p-6 bg-gray-50">
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="flex-1 bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
                    >
                      View Details
                    </button>
                    
                    {order.status === OrderStatus.COMPLETED && (
                      <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:border-black hover:text-black transition-colors">
                        Reorder
                      </button>
                    )}
                    
                    {order.status === OrderStatus.READY_FOR_PICKUP && (
                      <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Confirm Pickup
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
