'use client'

import React from 'react'
import AuthForm from '@/components/AuthForm'
import { AuthProvider } from '@/contexts/AuthContext'

export default function LoginPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <AuthForm />
      </div>
    </AuthProvider>
  )
}