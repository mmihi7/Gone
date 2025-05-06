// src/components/Sidebar.tsx
'use client'

import React from 'react'
import { 
  Home, Bookmark, TrendingUp, MessageCircle, Settings, Search, User, Heart, LogIn, LogOut, LucideIcon 
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const NavItem: React.FC<NavItemProps> = ({ 
    icon: Icon, 
    label, 
    active = false, 
    onClick = () => {} 
  }) => (
    <div 
      onClick={onClick}
      className={`
        flex items-center space-x-3 p-3 rounded-lg cursor-pointer 
        ${active ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}
      `}
    >
      <Icon size={20} />
      <span className="text-sm">{label}</span>
    </div>
  )

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  const loggedInNavItems = [
    { 
      icon: Home, 
      label: 'Deals', 
      onClick: () => handleNavigation('/deals') 
    },
    { 
      icon: User, 
      label: 'Profile', 
      onClick: () => handleNavigation('/profile') 
    },
    { 
      icon: Heart, 
      label: 'Following', 
      onClick: () => handleNavigation('/following') 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      onClick: () => handleNavigation('/settings') 
    },
    { 
      icon: LogOut, 
      label: 'Log Out', 
      onClick: handleLogout 
    }
  ]

  const loggedOutNavItems = [
    { 
      icon: Home, 
      label: 'Deals', 
      onClick: () => handleNavigation('/deals') 
    },
    { 
      icon: LogIn, 
      label: 'Log In', 
      onClick: () => handleNavigation('/login') 
    }
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6 flex flex-col z-50">
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Gone in Seconds</h2>
        
        {/* Search Bar */}
        <div className="mb-6 relative">
          <input 
            type="text" 
            placeholder="Search deals..." 
            className="w-full p-2 pl-10 bg-gray-800 text-white rounded-lg"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>

        <nav className="space-y-4">
          {user 
            ? loggedInNavItems.map((item, index) => (
                <NavItem 
                  key={item.label} 
                  icon={item.icon} 
                  label={item.label} 
                  onClick={item.onClick}
                  active={index === 0}
                />
              ))
            : loggedOutNavItems.map((item, index) => (
                <NavItem 
                  key={item.label} 
                  icon={item.icon} 
                  label={item.label} 
                  onClick={item.onClick}
                  active={index === 0}
                />
              ))
          }
        </nav>
      </div>
    </div>
  )
}

export default Sidebar