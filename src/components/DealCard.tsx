// src/components/DealCard.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Users, CheckCircle, ThumbsUp, ThumbsDown, MessageCircle, Share2 } from 'lucide-react'
import { getDiscountColor, getPriceColor } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useDealInteraction'
import { useRouter } from 'next/navigation'

interface DealCardProps {
  id: string
  imgUrl?: string
  imageUrls?: string[]
  title: string
  description: string
  discount: number
  timeLeft: number
  watchCount: number
  claimedCount: number
  originalPrice: number
  discountPrice: number
  upvotes?: number
  downvotes?: number
  verified?: boolean
  category?: string
  collectionLocation?: string
  collectionTimeLimit?: number
  terms?: string
  location?: string
  price?: number
}

const DealCard: React.FC<DealCardProps> = ({
  id,
  imgUrl,
  imageUrls,
  title,
  description,
  discount,
  timeLeft,
  watchCount,
  claimedCount,
  originalPrice,
  discountPrice,
  upvotes,
  downvotes,
  verified,
  category,
  collectionLocation,
  collectionTimeLimit,
  terms,
  location,
  price
}) => {
  // Combine imgUrl and imageUrls, prioritizing imageUrls
  const images = imageUrls && imageUrls.length > 0 
    ? imageUrls 
    : (imgUrl ? [imgUrl] : [])
  
  // Fallback image URL
  const fallbackImageUrl = "https://via.placeholder.com/800x600.png?text=Deal+Image+Not+Available"
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(timeLeft)
  const [isExpired, setIsExpired] = useState(false)
  
  // Set up countdown timer
  useEffect(() => {
    // If already expired, don't start the timer
    if (timeLeft <= 0) {
      setIsExpired(true)
      return
    }

    // Set up the countdown interval
    const intervalId = setInterval(() => {
      setRemainingSeconds(prevSeconds => {
        // When we reach zero, clear the interval and mark as expired
        if (prevSeconds <= 1) {
          clearInterval(intervalId)
          setIsExpired(true)
          return 0
        }
        // Otherwise decrement the counter
        return prevSeconds - 1
      })
    }, 1000) // Update every second

    // Clean up the interval on unmount
    return () => clearInterval(intervalId)
  }, [timeLeft]) // Re-run if timeLeft prop changes

  // Format time left in seconds - just the number, no "s" suffix
  const formatTimeLeft = (seconds: number) => {
    return `${seconds}`
  }

  // Handle image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  // Handle share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this deal: ${title} - ${discount}% OFF!`,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing:', error))
    } else {
      console.log('Web Share API not supported')
    }
  }

  // Get colors based on discount percentage
  const buttonColorClass = getDiscountColor(discount);
  const priceColorClass = getPriceColor(discount);

  // Calculate verification status based on net likes (upvotes - downvotes)
  const getVerificationStatus = () => {
    const netLikes = (upvotes || 0) - (downvotes || 0);
    return netLikes >= 60;
  };

  // Determine if the deal is verified based on net likes
  const isVerified = getVerificationStatus();

  const isMobile = useIsMobile();

  const router = useRouter()
  
  // Navigate to deal details page
  const viewDealDetails = () => {
    router.push(`/deals/${id}`)
  }
  
  // Handle interaction that requires auth
  const handleAuthRequiredAction = (action: string, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent navigating to details page
    
    // Show auth modal (placeholder for now - would be replaced with actual modal)
    alert(`Please sign in to ${action}`)
    
    // In a real implementation, you would show a modal:
    // setShowAuthModal(true)
    // setRequiredAction(action)
  }

  return (
    <div className="relative h-[calc(100vh-0px)] w-full max-w-full md:max-w-[60%] lg:max-w-[45%] xl:max-w-[45%] mx-auto overflow-hidden my-4">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image 
              src={images[currentImageIndex] || fallbackImageUrl}
              alt={title}
              fill
              priority
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = fallbackImageUrl
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />

        {/* Countdown Timer */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[90%] text-center text-white text-opacity-70 text-[10rem] z-30 leading-none font-black">
          {remainingSeconds > 0 ? remainingSeconds : '0'}
        </div>

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 backdrop-blur-sm p-2 rounded-full"
            >
              ←
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 backdrop-blur-sm p-2 rounded-full"
            >
              →
            </button>
          </>
        )}

        {/* Interaction Buttons - Right side vertical column */}
        <div className="absolute right-3 bottom-[30%] z-30 flex flex-col space-y-6">
          {/* Upvote */}
          <div className="flex flex-col items-center">
            <button 
              onClick={(e) => handleAuthRequiredAction('upvote', e)}
              className="bg-black/40 rounded-full p-3 mb-1 hover:bg-black/60"
            >
              <ThumbsUp size={24} className="text-white" />
            </button>
            <span className="text-xs text-white font-semibold">{upvotes || 0}</span>
          </div>
          
          {/* Downvote */}
          <div className="flex flex-col items-center">
            <button 
              onClick={(e) => handleAuthRequiredAction('downvote', e)}
              className="bg-black/40 rounded-full p-3 mb-1 hover:bg-black/60"
            >
              <ThumbsDown size={24} className="text-white" />
            </button>
            <span className="text-xs text-white font-semibold">{downvotes || 0}</span>
          </div>
          
          {/* Comments */}
          <div className="flex flex-col items-center">
            <button 
              onClick={(e) => handleAuthRequiredAction('comment', e)}
              className="bg-black/40 rounded-full p-3 mb-1 hover:bg-black/60"
            >
              <MessageCircle size={24} className="text-white" />
            </button>
            <span className="text-xs text-white font-semibold">0</span>
          </div>
          
          {/* Share */}
          <div className="flex flex-col items-center">
            <button 
              onClick={handleShare}
              className="bg-black/40 rounded-full p-3 mb-1 hover:bg-black/60"
            >
              <Share2 size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col p-3 pb-8 bg-gradient-to-t from-black/90 to-transparent pt-20">
          {/* Social Proof Row */}
          <div className="mb-2 flex items-center">
            <div className="border border-white text-white px-1.5 py-0.5 rounded-full flex items-center space-x-0.5 mr-1">
              <Eye size={8} className="text-white" />
              <span className="text-[9px]">{watchCount}</span>
              <span className="text-[9px] hidden md:inline">watching</span>
            </div>
            <div className="border border-white text-white px-1.5 py-0.5 rounded-full flex items-center space-x-0.5 mr-1">
              <Users size={8} className="text-white" />
              <span className="text-[9px]">{claimedCount}</span>
              <span className="text-[9px] hidden md:inline">claimed</span>
            </div>
            <div className="border border-white text-white px-1.5 py-0.5 rounded-full flex items-center space-x-0.5">
              {isVerified ? (
                <>
                  <CheckCircle size={8} className="text-white" />
                  <span className="text-[9px]">Verified</span>
                </>
              ) : (
                <span className="text-[9px]">Unverified</span>
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold mb-2 line-clamp-2 text-white">{title}</h2>
          
          {/* Description */}
          <p className="text-sm mb-2 line-clamp-2 hidden md:block text-white">{description}</p>

          {/* Price Information */}
          <div className="mb-3">
            <div className="flex items-baseline space-x-2">
              <span className={`text-3xl font-extrabold ${priceColorClass}`}>
                Ksh {Math.round(discountPrice || 0).toLocaleString()}
              </span>
              <span className={`text-xs font-bold ${priceColorClass}`}>
                {discount}% OFF
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs line-through text-gray-400">
                Ksh {Math.round(originalPrice || 0).toLocaleString()}
              </span>
              {location && (
                <div className="text-xs text-white truncate max-w-[50%]">
                  📍 {location}
                </div>
              )}
            </div>
          </div>

          {/* View Deal Details Button */}
          <button 
            onClick={viewDealDetails}
            disabled={isExpired}
            className={`w-full ${isExpired ? 'bg-gray-500' : buttonColorClass} text-white font-bold py-3 rounded-lg text-sm transition-colors mt-1`}
          >
            {isExpired ? "Deal Expired" : "Claim this Deal"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DealCard
