'use client';

import { Order, OrderStatus } from '../types';

interface OrderTrackingProps {
  order: Order;
}

const statusConfig = {
  [OrderStatus.PENDING]: {
    label: 'Order Placed',
    description: 'Your order has been received and is being processed',
    icon: '📝',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  [OrderStatus.CONFIRMED]: {
    label: 'Order Confirmed',
    description: 'Kitchen has accepted your order and started preparation',
    icon: '✅',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  [OrderStatus.IN_PROGRESS]: {
    label: 'In Progress',
    description: 'Your food is being prepared in the kitchen',
    icon: '👨‍🍳',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  [OrderStatus.READY_FOR_PICKUP]: {
    label: 'Ready for Pickup',
    description: 'Your order is ready! Please collect from the counter',
    icon: '🎉',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  [OrderStatus.COMPLETED]: {
    label: 'Completed',
    description: 'Order has been completed successfully',
    icon: '🎊',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelled',
    description: 'Order has been cancelled',
    icon: '❌',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
};

const statusOrder = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.IN_PROGRESS,
  OrderStatus.READY_FOR_PICKUP,
  OrderStatus.COMPLETED
];

export default function OrderTracking({ order }: OrderTrackingProps) {
  const currentStatusIndex = statusOrder.indexOf(order.status);
  const isCompleted = order.status === OrderStatus.COMPLETED;
  const isCancelled = order.status === OrderStatus.CANCELLED;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Order Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-black">Order #{order.orderNumber}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusConfig[order.status].bgColor
          } ${statusConfig[order.status].color} ${statusConfig[order.status].borderColor} border`}>
            {statusConfig[order.status].icon} {statusConfig[order.status].label}
          </span>
        </div>
        <p className="text-gray-600">
          Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-black mb-3">Order Summary</h3>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.quantity}x {item.item.name}
              </span>
              <span className="text-black font-medium">₹{item.item.price * item.quantity}</span>
            </div>
          ))}
          <hr className="border-gray-200 my-2" />
          <div className="flex justify-between font-medium">
            <span className="text-black">Total Amount</span>
            <span className="text-black">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Pickup Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-black mb-3">Pickup Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Pickup Location:</span>
            <span className="text-black">{order.pickupLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Estimated Pickup:</span>
            <span className="text-black">
              {new Date(order.estimatedPickupTime).toLocaleTimeString()}
            </span>
          </div>
          {order.specialInstructions && (
            <div className="pt-2 border-t border-gray-200">
              <span className="text-gray-600">Special Instructions: </span>
              <span className="text-black">{order.specialInstructions}</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mb-6">
        <h3 className="font-medium text-black mb-4">Order Progress</h3>
        <div className="space-y-4">
          {statusOrder.map((status, index) => {
            const config = statusConfig[status];
            const isActive = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            
            return (
              <div key={status} className="flex items-start gap-4">
                {/* Status Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isActive 
                    ? `${config.bgColor} ${config.color}` 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <span className="text-sm">{config.icon}</span>
                </div>

                {/* Status Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium ${
                      isActive ? 'text-black' : 'text-gray-400'
                    }`}>
                      {config.label}
                    </h4>
                    {isCurrent && (
                      <span className="px-2 py-1 bg-black text-white text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    isActive ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {config.description}
                  </p>
                </div>

                {/* Timeline Line */}
                {index < statusOrder.length - 1 && (
                  <div className={`w-0.5 h-8 ml-4 ${
                    isActive ? 'bg-gray-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {order.status === OrderStatus.READY_FOR_PICKUP && (
          <button className="flex-1 bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Confirm Pickup
          </button>
        )}
        
        {!isCompleted && !isCancelled && (
          <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:border-black hover:text-black transition-colors">
            Contact Support
          </button>
        )}
        
        <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:border-black hover:text-black transition-colors">
          View Receipt
        </button>
      </div>
    </div>
  );
}
