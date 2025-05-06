// src/components/DealFeed.tsx
'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import DealCard from './DealCard'
import { mockDeals } from '@/lib/mockData'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaOptionsType } from 'embla-carousel'

const DealFeed: React.FC = () => {
  // Carousel configuration
  const carouselOptions: EmblaOptionsType = {
    loop: true,
    axis: 'y', // Vertical scrolling
    dragFree: false,
    containScroll: 'trimSnaps'
  }

  // Setup Embla carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions)
  const [currentDealIndex, setCurrentDealIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrolling = useRef<boolean>(false)

  // Handle slide changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentDealIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // Setup event listeners
  useEffect(() => {
    if (!emblaApi) return
    
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Try a completely different approach for mouse wheel
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // Check if we should handle this event
      const target = event.target as Node;
      const container = containerRef.current;
      
      if (container && container.contains(target) && emblaApi) {
        // Prevent default scrolling
        event.preventDefault();
        
        // Determine direction and scroll
        const direction = Math.sign(event.deltaY);
        if (direction > 0) {
          emblaApi.scrollNext();
        } else if (direction < 0) {
          emblaApi.scrollPrev();
        }
      }
    };
    
    // Use the capture phase to intercept events early
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    
    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, [emblaApi]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!emblaApi) return
      
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        emblaApi.scrollNext()
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        emblaApi.scrollPrev()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [emblaApi])

  return (
    <div className="h-screen overflow-hidden" ref={containerRef}>
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full flex flex-col">
          {mockDeals.map((deal, index) => (
            <div key={deal.id} className="embla__slide flex-shrink-0 min-h-screen">
              <DealCard 
                id={deal.id}
                imgUrl={deal.imgUrl}
                imageUrls={deal.imageUrls}
                title={deal.title}
                description={deal.description}
                discount={deal.discountPercentage}
                timeLeft={deal.timeLeftSeconds}
                watchCount={deal.watching}
                claimedCount={deal.claimed}
                originalPrice={deal.originalPrice}
                discountPrice={deal.discountPrice}
                upvotes={deal.upvotes}
                downvotes={deal.downvotes}
                verified={deal.verified}
                category={deal.category}
                collectionLocation={deal.collectionLocation}
                collectionTimeLimit={deal.collectionTimeLimit}
                terms={deal.terms}
                location={deal.collectionLocation}
                price={deal.discountPrice}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DealFeed
