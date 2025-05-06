
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { mockDeals, Deal } from '@/lib/mockData'
import Image from 'next/image'
import { 
  Eye, 
  CheckCircle, 
  ShoppingCart, 
  ArrowLeft, 
  User, 
  Settings, 
  PlusCircle, 
  List, 
  X, 
  Home, 
  Bell, 
  Moon, 
  Sun,
  ThumbsUp,
  Share2,
  Plus,
  Minus
} from 'lucide-react'

export default function DealDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const dealId = params.id as string
  const [deal, setDeal] = useState<Deal | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'terms'>('description')
  const [cartItems, setCartItems] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Find the deal from mock data
    const foundDeal = mockDeals.find(d => d.id === dealId)
    setDeal(foundDeal || null)
  }, [dealId])

  const goBack = () => {
    router.push('/')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // TODO: Implement actual dark mode logic
  }

  const navigateTo = (route: string) => {
    router.push(route)
    setIsMobileMenuOpen(false)
  }

  const addToCart = () => {
    // TODO: Implement actual add to cart logic
    setCartItems(prev => prev + quantity)
    alert(`Added ${quantity} deal(s) to cart`)
  }

  // Quantity and price calculations
  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1))
  const totalPrice = deal ? Math.round(deal.discountPrice * quantity) : 0

  return (
    <div className={`relative min-h-screen w-full max-w-full md:max-w-[60%] lg:max-w-[45%] xl:max-w-[45%] mx-auto bg-white shadow-lg ${isDarkMode ? 'dark' : ''}`}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto">
          <div className="p-6">
            <button 
              onClick={toggleMobileMenu} 
              className="absolute top-4 right-4 text-gray-700 dark:text-gray-200"
            >
              <X size={24} />
            </button>
            
            <div className="space-y-6 mt-16">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Menu</h2>
              
              <button 
                onClick={() => navigateTo('/profile')}
                className="w-full text-left flex items-center space-x-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg"
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              
              <button 
                onClick={() => navigateTo('/deals/create')}
                className="w-full text-left flex items-center space-x-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg"
              >
                <PlusCircle size={20} />
                <span>Create Deal</span>
              </button>
              
              <button 
                onClick={() => navigateTo('/my-deals')}
                className="w-full text-left flex items-center space-x-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg"
              >
                <List size={20} />
                <span>My Deals</span>
              </button>
              
              <button 
                onClick={toggleDarkMode}
                className="w-full text-left flex items-center space-x-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              
              <button 
                onClick={() => navigateTo('/settings')}
                className="w-full text-left flex items-center space-x-4 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg"
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Header with Deal Title and Back Button */}
        <div className="mb-6 border-b pb-4 relative">
          <button 
            onClick={goBack}
            className="mb-2 text-gray-700 hover:text-black transition-colors self-start"
          >
            <ArrowLeft size={24} />
          </button>
          
          {/* Mobile Profile Button - Top Right */}
          <button 
            onClick={toggleMobileMenu}
            className="absolute top-0 right-0 text-gray-700 hover:text-black transition-colors"
          >
            <User size={24} />
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800">{deal?.title}</h1>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <span className="mr-4">
              <Eye size={16} className="inline-block mr-1" /> 
              {deal?.watching} Watching
            </span>
            <span>
              <CheckCircle size={16} className="inline-block mr-1 text-green-500" /> 
              {deal?.verified ? 'Verified Deal' : 'Unverified'}
            </span>
          </div>
        </div>

        {/* Desktop Sidebar - Left of Viewport */}
        <div className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-r-lg p-4">
          <div className="space-y-4">
            <button 
              onClick={() => navigateTo('/profile')}
              className="flex items-center text-gray-700 hover:text-black transition-colors"
            >
              <User size={20} className="mr-2" />
              Profile
            </button>
            <button 
              onClick={() => navigateTo('/deals/create')}
              className="flex items-center text-gray-700 hover:text-black transition-colors"
            >
              <PlusCircle size={20} className="mr-2" />
              Create Deal
            </button>
            <button 
              onClick={() => navigateTo('/my-deals')}
              className="flex items-center text-gray-700 hover:text-black transition-colors"
            >
              <List size={20} className="mr-2" />
              My Deals
            </button>
            <button 
              onClick={() => navigateTo('/settings')}
              className="flex items-center text-gray-700 hover:text-black transition-colors"
            >
              <Settings size={20} className="mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Deal Interaction Section */}
        <div className="mt-6 space-y-4">
          {/* Simplified Interaction Icons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button className="flex items-center text-gray-600 hover:text-blue-500">
                <Eye size={20} />
                <span className="ml-1 text-sm">{deal?.watching || 0}</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-green-500">
                <ThumbsUp size={20} />
                <span className="ml-1 text-sm">{deal?.upvotes || 0}</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-red-500">
                <Share2 size={20} />
              </button>
            </div>
            
            {/* Remaining Inventory Badge */}
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
              {deal?.inventory || 0}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={decreaseQuantity}
                className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300"
              >
                <Minus size={16} />
              </button>
              <span className="text-xl font-bold">{quantity}</span>
              <button 
                onClick={increaseQuantity}
                className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {/* Total Price */}
            <div className="text-xl font-bold text-green-600">
              Ksh {totalPrice.toLocaleString()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              className="w-full border border-blue-500 text-blue-500 py-3 rounded-lg text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors"
              onClick={() => {
                // TODO: Implement view details or more info
                alert('More Deal Details')
              }}
            >
              More Details
            </button>
            <button 
              className="w-full border border-green-500 text-green-500 py-3 rounded-lg text-sm font-medium hover:bg-green-500 hover:text-white transition-colors"
              onClick={addToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
