'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Maximize2, X, ArrowRight } from 'lucide-react';
import { GalleryItem, NGO } from '@/types/database';

interface GalleryPreviewProps {
  ngo: NGO;
  items: GalleryItem[];
}

export default function GalleryPreview({ ngo, items }: GalleryPreviewProps) {
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const displayItems = items.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-[#FCFBF8] border-b border-[#E8E5DE] relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] bg-[#087FC1]/10 px-3 py-1 rounded-md">
              Documentary Records
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#172B4D] mt-3 tracking-tight font-heading">
              Moments from the Ground
            </h2>
            <p className="text-base text-[#73777D] mt-2 max-w-xl font-body">
              Authentic on-ground photographs of our volunteers, trustees, and children during community education and healthcare drives in Dehradun.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center text-xs font-bold text-[#087FC1] hover:text-[#076ea7] group"
          >
            <span>View Complete Gallery</span>
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Gallery Grid (Documentary-Style Photographic Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative h-72 rounded-xl overflow-hidden cursor-pointer shadow-subtle hover:shadow-warm transition-all duration-200 border border-[#E8E5DE] bg-[#F5F2EA]"
            >
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-103 transition-transform duration-300"
              />

              {/* Natural subtle gradient for caption legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#172B4D]/85 via-transparent to-transparent opacity-90 transition-opacity" />

              {/* Zoom pill button */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Caption Content */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5C518]">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5 line-clamp-1 font-heading">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-xs text-[#F5F2EA]/80 mt-1 line-clamp-2 font-body">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {displayItems.length === 0 && (
          <div className="bg-[#F5F2EA] rounded-2xl border border-[#E8E5DE] p-10 text-center max-w-xl mx-auto shadow-subtle my-6">
            <Maximize2 className="w-10 h-10 text-[#73777D] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#172B4D] font-heading">Documentary Photographs</h3>
            <p className="text-xs text-[#73777D] mt-1.5 leading-relaxed font-body">
              On-ground documentary photographs of field drives in Dehradun are curated and published following community privacy review.
            </p>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B4D]/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#172B4D] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/40 hover:bg-black/70 text-white transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-[65vh] w-full bg-black/90">
              <Image
                src={activeImage.image_url}
                alt={activeImage.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-6 bg-[#172B4D] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F5C518]">
                  {activeImage.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-1 font-heading">{activeImage.title}</h3>
                {activeImage.caption && (
                  <p className="text-xs text-[#F5F2EA]/80 mt-1 max-w-xl font-body">{activeImage.caption}</p>
                )}
              </div>

              <Link
                href="/donate"
                className="px-5 h-[42px] rounded-xl text-xs font-bold text-white bg-[#087FC1] hover:bg-[#076ea7] inline-flex items-center justify-center transition shrink-0"
              >
                Support This Cause
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
