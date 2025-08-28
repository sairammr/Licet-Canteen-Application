'use client';

import { useState } from 'react';
import { MenuItem } from '../types';

interface MenuSectionProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuSection({ items, onAddToCart }: MenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'preparationTime'>('name');

  const filteredAndSortedItems = items
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'preparationTime':
          return a.preparationTime - b.preparationTime;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200 text-lg shadow-sm"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-all duration-200 bg-white shadow-sm text-lg font-medium"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="preparationTime">Sort by Prep Time</option>
        </select>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAndSortedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-black hover:-translate-y-1"
          >
            {/* Item Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg className="w-20 h-20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Food Image</p>
              </div>
            </div>

            {/* Item Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-black leading-tight">{item.name}</h3>
                <span className="text-2xl font-bold text-black">₹{item.price}</span>
              </div>
              
              <p className="text-gray-600 text-base mb-4 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              {/* Dietary Info and Allergens */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {item.dietaryInfo.isVeg && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium border border-green-200">
                    🥬 Veg
                  </span>
                )}
                {!item.dietaryInfo.isVeg && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full font-medium border border-red-200">
                    🍖 Non-Veg
                  </span>
                )}
                {item.dietaryInfo.isSpicy && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium border border-orange-200">
                    🌶️ Spicy
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium border border-gray-200">
                  ⏱️ {item.preparationTime} min
                </span>
              </div>

              {/* Allergens */}
              {item.allergens.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Allergens:</p>
                  <div className="flex flex-wrap gap-2">
                    {item.allergens.map((allergen, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-lg font-medium border border-yellow-200"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => onAddToCart(item)}
                disabled={!item.isAvailable}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                  item.isAvailable
                    ? 'bg-black text-white hover:bg-gray-800 active:scale-95 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {item.isAvailable ? 'Add to Cart' : 'Currently Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No items found</h3>
          <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
