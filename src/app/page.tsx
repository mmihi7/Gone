// src/app/page.tsx
'use client'

import Sidebar from '@/components/Sidebar'
import DealFeed from '@/components/DealFeed'
import DealCard from '@/components/DealCard'

export default function Home() {
  // Manually add all required props for DealCard
  const dealProps = {
    id: '1',
    title: 'Sample Deal',
    description: 'A sample deal description',
    imgUrl: '/path/to/sample/image.jpg',
    imageUrls: ['/path/to/sample/image.jpg'],
    discount: 50,
    timeLeft: 3600, // 1 hour in seconds
    watchCount: 100,
    claimedCount: 25,
    originalPrice: 200,
    discountPrice: 100,
    upvotes: 75,
    downvotes: 10,
    verified: true,
    category: 'Electronics',
    collectionLocation: 'Nairobi',
    collectionTimeLimit: 48,
    terms: 'Deal valid for 48 hours',
    location: 'Westlands, Nairobi',
    price: 100
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="ml-64 flex-grow">
        <DealFeed />
        <DealCard {...dealProps} />
      </main>
    </div>
  )
}