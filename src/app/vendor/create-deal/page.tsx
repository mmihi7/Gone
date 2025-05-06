'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function CreateDealPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [isVendorLoading, setIsVendorLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Basic form with minimal fields for testing
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Create New Deal</h1>
      <p>This is a test page to verify routing is working.</p>
    </div>
  )
}


