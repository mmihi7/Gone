'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { PlusCircle, Package, Settings, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface VendorDeal {
  id: string
  title: string
  discount_percentage: number
  original_price: number
  discount_price: number
  inventory: number
  claimed: number
  status: string
  created_at: string
  image_url: string | null
}

export default function VendorDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [vendorStatus, setVendorStatus] = useState<string | null>(null)
  const [deals, setDeals] = useState<VendorDeal[]>([])
  const [isVendorLoading, setIsVendorLoading] = useState(true)
  const [isDealsLoading, setIsDealsLoading] = useState(true)

  // Check if user is a vendor
  useEffect(() => {
    async function checkVendorStatus() {
      if (!user) return
      
      try {
        const { data, error } = await supabase
          .from('vendors')
          .select('id, status')
          .eq('user_id', user.id)
          .single()

        if (error) {
          console.error('Error checking vendor status:', error)
          router.push('/become-vendor')
        } else if (data) {
          setVendorId(data.id)
          setVendorStatus(data.status)
        } else {
          router.push('/become-vendor')
        }
      } catch (err) {
        console.error('Error checking vendor status:', err)
        router.push('/become-vendor')
      } finally {
        setIsVendorLoading(false)
      }
    }
    checkVendorStatus()
  }, [user, router])

  // Fetch deals if user is a vendor
  useEffect(() => {
    if (vendorId && vendorStatus! == 'pending') {
      async function fetchDeals() {
        try {
          const { data, error } = await supabase
            .from('deals')
            .select('*')
            .eq('vendor_id', vendorId)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('Error fetching deals:', error)
          } else if (data) {
            setDeals(data)
          }
        } catch (err) {
          console.error('Error fetching deals:', err)
        } finally {
          setIsDealsLoading(false)
        }
      }
      fetchDeals()
    }
  }, [vendorId, vendorStatus])

  if (isLoading || isVendorLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please log in to view your dashboard.</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <Link 
          href="/vendor/create-deal" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusCircle className="mr-2" size={18} />
          List a Deal
        </Link>
      </div>
      
      {/* Rest of your dashboard content */}
    </div>
  )
}




