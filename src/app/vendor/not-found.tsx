import Link from 'next/link'

export default function VendorNotFound() {
  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="mb-6">The vendor page you're looking for doesn't exist or has been moved.</p>
      <Link 
        href="/vendor/dashboard" 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Return to Vendor Dashboard
      </Link>
    </div>
  )
}