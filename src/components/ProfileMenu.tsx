'use client'

import React, { useState } from 'react'
import { User, LogIn, LogOut, Package, PlusCircle, Settings, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AuthForm from './AuthForm'

const ProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const router = useRouter()
  const { user, signOut, isLoading } = useAuth()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const handleNavigation = (path: string) => {
    router.push(path)
    closeMenu()
  }

  const handleAuthAction = async (action: string) => {
    if (action === 'login' || action === 'signup') {
      setShowAuthForm(true)
    } else if (action === 'logout') {
      await signOut()
    }
    closeMenu()
  }

  if (isLoading) {
    return (
      <div className="p-2">
        <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Profile Icon Button */}
      <button 
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Open profile menu"
      >
        <User size={24} className="text-gray-800" />
      </button>

      {/* Auth Form Modal */}
      {showAuthForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <AuthForm 
            onSuccess={() => setShowAuthForm(false)}
            onCancel={() => setShowAuthForm(false)}
          />
        </div>
      )}

      {/* Sidebar Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeMenu}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white text-black shadow-lg z-50 transform transition-transform">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Menu</h2>
                <button onClick={closeMenu} className="p-1">
                  <Menu size={24} />
                </button>
              </div>
            </div>

            <div className="p-4">
              {user ? (
                <>
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="font-medium">{user.email?.split('@')[0] || 'User'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <nav className="space-y-1">
                    <button 
                      onClick={() => handleNavigation('/profile')}
                      className="flex items-center space-x-3 w-full p-2 rounded hover:bg-gray-100"
                    >
                      <User size={18} />
                      <span>My Profile</span>
                    </button>
                    <button 
                      onClick={() => handleNavigation('/my-deals')}
                      className="flex items-center space-x-3 w-full p-2 rounded hover:bg-gray-100"
                    >
                      <Package size={18} />
                      <span>My Deals</span>
                    </button>
                    <button 
                      onClick={() => handleNavigation('/create-deal')}
                      className="flex items-center space-x-3 w-full p-2 rounded hover:bg-gray-100"
                    >
                      <PlusCircle size={18} />
                      <span>List a Deal</span>
                    </button>
                    <button 
                      onClick={() => handleNavigation('/settings')}
                      className="flex items-center space-x-3 w-full p-2 rounded hover:bg-gray-100"
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                    <hr className="my-2" />
                    <button 
                      onClick={() => handleAuthAction('logout')}
                      className="flex items-center space-x-3 w-full p-2 rounded hover:bg-gray-100 text-red-500"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </nav>
                </>
              ) : (
                <>
                  <div className="mb-6 text-center">
                    <p className="text-gray-600 mb-4">Sign in to access all features</p>
                    <button
                      onClick={() => handleAuthAction('login')}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg mb-2 hover:bg-blue-700"
                    >
                      <div className="flex items-center justify-center">
                        <LogIn size={18} className="mr-2" />
                        <span>Login</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleAuthAction('signup')}
                      className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50"
                    >
                      <div className="flex items-center justify-center">
                        <User size={18} className="mr-2" />
                        <span>Sign Up</span>
                      </div>
                    </button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Why sign up?</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Save and track your favorite deals</li>
                      <li>• Get notified about new deals</li>
                      <li>• Post your own deals</li>
                      <li>• Leave reviews and comments</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProfileMenu

