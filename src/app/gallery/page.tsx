'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Maximize2, X } from 'lucide-react';
import { GalleryItem, NGO, SiteSettings } from '@/types/database';

function GalleryContent() {
  const searchParams = useSearchParams();
  const ngoSlug = searchParams.get('ngo') || 'the-crawl-foundation';

  const [siteData, setSiteData] = useState<{
    ngo: NGO;
    settings: SiteSettings;
    gallery: GalleryItem[];
  } | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/site-data?ngo=${ngoSlug}`);
        const json = await res.json();
        setSiteData(json);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [ngoSlug]);

  if (!siteData) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#087FC1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { ngo, settings, gallery } = siteData;

  const categories = ['All', ...Array.from(new Set(gallery.map((g) => g.category)))];

  const filteredItems =
    selectedCategory === 'All'
      ? gallery
      : gallery.filter((g) => g.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF8] text-[#292D32] selection:bg-[#087FC1] selection:text-white">
      <Navbar ngo={ngo} />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-[#F5F2EA] py-16 text-left border-b border-[#E8E5DE]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] bg-white px-3 py-1 rounded-md border border-[#E8E5DE] shadow-subtle">
              Documentary Evidence
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#172B4D] mt-3 tracking-tight font-heading leading-tight">
              On-Ground Activity Gallery
            </h1>
            <p className="text-base text-[#73777D] mt-3 leading-relaxed font-body">
              Real moments captured during our learning sessions, health checkups, and relief distributions in Dehradun settlements.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-[#172B4D] text-white shadow-subtle'
                      : 'bg-white text-[#292D32] border border-[#E8E5DE] hover:border-[#172B4D]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 lg:py-16">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveModalItem(item)}
                  className="group relative h-80 rounded-xl overflow-hidden cursor-pointer shadow-subtle hover:shadow-warm transition-all duration-200 border border-[#E8E5DE] bg-[#F5F2EA]"
                >
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#172B4D]/85 via-transparent to-transparent opacity-90 transition-opacity" />

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5C518]">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5 line-clamp-1 font-heading">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-[#F5F2EA]/80 mt-1 line-clamp-2 font-body">
                        {item.caption}
                      </p>
                    )}
                    {item.event_date && (
                      <span className="text-[10px] text-[#F5F2EA]/60 block mt-1">
                        Date: {item.event_date}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="bg-[#F5F2EA] rounded-2xl border border-[#E8E5DE] p-12 text-center max-w-xl mx-auto shadow-subtle my-6">
                <Maximize2 className="w-10 h-10 text-[#73777D] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#172B4D] font-heading">No Photographs in this Category</h3>
                <p className="text-xs text-[#73777D] mt-1.5 leading-relaxed font-body">
                  Field photographs are uploaded directly upon completion and trustee verification of community outreach drives.
                </p>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B4D]/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#172B4D] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/40 hover:bg-black/70 text-white transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-[65vh] w-full bg-black/90">
              <Image
                src={activeModalItem.image_url}
                alt={activeModalItem.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-6 bg-[#172B4D] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F5C518]">
                  {activeModalItem.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-1 font-heading">{activeModalItem.title}</h3>
                {activeModalItem.caption && (
                  <p className="text-xs text-[#F5F2EA]/80 mt-1 max-w-xl font-body">{activeModalItem.caption}</p>
                )}
              </div>

              <Link
                href={`/donate?ngo=${ngo.slug}`}
                className="px-5 h-[42px] rounded-xl text-xs font-bold text-white bg-[#087FC1] hover:bg-[#076ea7] inline-flex items-center justify-center transition shrink-0"
              >
                Support This Cause
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer ngo={ngo} settings={settings} />
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-[#087FC1] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GalleryContent />
    </Suspense>
  );
}
