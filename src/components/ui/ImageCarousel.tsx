"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  title: string;
  className?: string;
}

export function ImageCarousel({ images, title, className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Placeholder image for missing images
  const getImageSrc = (src: string) => {
    return src || '/images/placeholder-project.jpg';
  };

  if (images.length === 0) {
    return (
      <div className={cn("relative h-48 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg flex items-center justify-center", className)}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🏗️</div>
          <p className="text-sm">Project Images Coming Soon</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn("relative group", className)}>
        {/* Main Image Display */}
        <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={getImageSrc(images[currentIndex])}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = '/images/placeholder-project.jpg';
            }}
          />
          
          {/* Image Counter */}
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>

          {/* View Full Image Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-2 left-2 bg-black/50 text-white p-2 rounded hover:bg-black/70 transition-colors"
            title="View full image"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Loading overlay for broken images */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center opacity-0 transition-opacity">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-1">🏗️</div>
              <p className="text-xs">Loading...</p>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 justify-center">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-12 h-8 rounded border-2 overflow-hidden transition-all duration-200",
                  currentIndex === index
                    ? "border-green-500 scale-110"
                    : "border-gray-300 hover:border-green-300 opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={getImageSrc(image)}
                  alt={`Thumbnail ${index + 1}`}
                  width={48}
                  height={32}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder-project.jpg';
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl"
            >
              ✕ Close
            </button>
            <Image
              src={getImageSrc(images[currentIndex])}
              alt={`${title} - Full size`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder-project.jpg';
              }}
            />
            
            {/* Modal Navigation */}
            {images.length > 1 && (
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                <button
                  onClick={goToPrevious}
                  className="bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
