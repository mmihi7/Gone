'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function BecomeVendorPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    phoneNumber: '',
    address: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not logged in
  if (!isLoading && !user) {
    router.push('/auth/login?redirect=/become-vendor')
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Insert vendor data into vendors table
      const { error } = await supabase
        .from('vendors')
        .insert({
          user_id: user?.id,
          business_name: formData.businessName,
          business_type: formData.businessType,
          phone_number: formData.phoneNumber,
          address: formData.address,
          status: 'pending' // Vendors start with pending status
        })

      if (error) throw error

      // Redirect to vendor dashboard
      router.push('/vendor/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to register as vendor')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Become a Vendor</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Business Type</label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded text-black"
          >
            <option value="">Select business type</option>
            <option value="retail">Retail</option>
            <option value="food">Food & Beverage</option>
            <option value="electronics">Electronics</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Business Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Register as Vendor'}
        </button>
      </form>
    </div>
  )
}