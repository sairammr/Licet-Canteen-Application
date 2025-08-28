'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import MenuSection from '../components/MenuSection';
import Cart from '../components/Cart';

export default function MenuPage() {
  const router = useRouter();
  const { state, dispatch, addToCart } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Check authentication
    if (!state.isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Fetch menu data if not already loaded
    if (state.menuItems.length === 0) {
      fetchMenuData();
    }
  }, [state.isAuthenticated, state.menuItems.length, router]);

  const fetchMenuData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/menu');
      // const data = await response.json();
      
      // Mock data for now
      const mockMenuItems = [
        {
          id: '1',
          name: 'Masala Dosa',
          description: 'Crispy dosa with potato masala, served with coconut chutney and sambar',
          price: 45,
          category: 'breakfast',
          imageUrl: '/images/masala-dosa.jpg',
          isAvailable: true,
          preparationTime: 8,
          allergens: ['dairy'],
          dietaryInfo: { isVeg: true, isSpicy: false }
        },
        {
          id: '2',
          name: 'Chicken Biryani',
          description: 'Fragrant basmati rice with tender chicken, aromatic spices, and mint raita',
          price: 120,
          category: 'lunch',
          imageUrl: '/images/chicken-biryani.jpg',
          isAvailable: true,
          preparationTime: 15,
          allergens: ['nuts'],
          dietaryInfo: { isVeg: false, isSpicy: true }
        },
        {
          id: '3',
          name: 'Veg Thali',
          description: 'Complete Indian meal with dal, vegetables, rice, roti, and salad',
          price: 80,
          category: 'lunch',
          imageUrl: '/images/veg-thali.jpg',
          isAvailable: true,
          preparationTime: 12,
          allergens: ['gluten'],
          dietaryInfo: { isVeg: true, isSpicy: false }
        },
        {
          id: '4',
          name: 'Chicken Burger',
          description: 'Grilled chicken patty with lettuce, tomato, and special sauce',
          price: 95,
          category: 'snacks',
          imageUrl: '/images/chicken-burger.jpg',
          isAvailable: true,
          preparationTime: 10,
          allergens: ['gluten', 'dairy'],
          dietaryInfo: { isVeg: false, isSpicy: false }
        },
        {
          id: '5',
          name: 'Coffee',
          description: 'Hot filter coffee with milk and sugar',
          price: 25,
          category: 'beverages',
          imageUrl: '/images/coffee.jpg',
          isAvailable: true,
          preparationTime: 3,
          allergens: ['dairy'],
          dietaryInfo: { isVeg: true, isSpicy: false }
        },
        {
          id: '6',
          name: 'French Fries',
          description: 'Crispy golden fries with seasoning and ketchup',
          price: 60,
          category: 'snacks',
          imageUrl: '/images/french-fries.jpg',
          isAvailable: true,
          preparationTime: 7,
          allergens: [],
          dietaryInfo: { isVeg: true, isSpicy: false }
        }
      ];

      const mockCategories = [
        { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
        { id: 'lunch', name: 'Lunch', icon: '🍽️' },
        { id: 'snacks', name: 'Snacks', icon: '🍟' },
        { id: 'beverages', name: 'Beverages', icon: '☕' }
      ];

      dispatch({ type: 'SET_MENU_ITEMS', payload: mockMenuItems });
      dispatch({ type: 'SET_CATEGORIES', payload: mockCategories });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch menu data' });
      console.error('Error fetching menu data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleAddToCart = (item: any) => {
    addToCart(item);
    // Show a brief success message (you can implement a toast notification here)
  };

  const handleCheckout = () => {
    if (state.cart.length === 0) return;
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const filteredItems = selectedCategory === 'all'
    ? state.menuItems
    : state.menuItems.filter(item => item.category === selectedCategory);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Menu</h3>
          <p className="text-gray-500 mb-4">{state.error}</p>
          <button
            onClick={fetchMenuData}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        cartItemCount={state.cart.length}
        onCartClick={() => setIsCartOpen(true)}
        onProfileClick={() => router.push('/profile')}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">What would you like to eat?</h1>
          <p className="text-gray-600 text-lg">Browse our delicious menu and order your favorite meals</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 bg-white text-black hover:border-black'
              }`}
            >
              All Items ({state.menuItems.length})
            </button>
            {state.categories.map((category) => {
              const count = state.menuItems.filter(item => item.category === category.id).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-black hover:border-black'
                  }`}
                >
                  {category.icon} {category.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Section */}
        <MenuSection
          items={filteredItems}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Cart Modal */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
