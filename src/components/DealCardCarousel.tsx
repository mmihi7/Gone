'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaOptionsType } from 'embla-carousel'

interface DealCardCarouselProps {
  images: string[]
  title: string
}

const DealCardCarousel: React.FC<DealCardCarouselProps> = ({ images, title }) => {
  // Carousel configuration
  const carouselOptions: EmblaOptionsType = {
    loop: true,
    axis: 'y', // Change to vertical axis
    align: 'center',
    skipSnaps: false,
    inViewThreshold: 0.7
  }

  // Carousel state management
  const [emblaRef, emblaApi] = useEmblaCarousel(carouselOptions)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  // Slide selection handler
  const onSelect = useCallback((api: any) => {
    if (!api) return

    setCurrentSlide(api.selectedScrollSnap())
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  // Setup event listeners
  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('select', onSelect)
    onSelect(emblaApi)

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!emblaApi) return

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      emblaApi.scrollPrev()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  // Debug logging
  useEffect(() => {
    console.log('Carousel Images:', images)
  }, [images])

  return (
    <div 
      className="relative h-screen w-full max-w-full md:max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] mx-auto overflow-hidden"
      onKeyDownCapture={handleKeyDown}
      role="region"
      aria-roledescription="image carousel"
    >
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full flex flex-col">
          {images.map((imageUrl, index) => (
            <div 
              key={index} 
              className="embla__slide flex-grow-0 flex-shrink-0 w-full h-full relative"
            >
              <Image 
                src={imageUrl}
                alt={`${title} image ${index + 1}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain" // Changed from object-cover to object-contain
                onError={(e) => {
                  console.error('Image load error:', imageUrl)
                  e.currentTarget.style.backgroundColor = 'red' // Visual debug
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col space-y-4 z-10">
        <button 
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className={`w-8 h-8 rounded-full bg-white/50 ${!canScrollPrev ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Previous slide"
        >
          ↑
        </button>
        
        {/* Slide Indicators */}
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
        
        <button 
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className={`w-8 h-8 rounded-full bg-white/50 ${!canScrollNext ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Next slide"
        >
          ↓
        </button>
      </div>
    </div>
  )
}

export default DealCardCarousel