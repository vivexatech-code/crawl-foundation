'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { NGO, HomepageContent } from '@/types/database';

interface HeroSectionProps {
  ngo: NGO;
  content: HomepageContent;
}

export default function HeroSection({ ngo, content }: HeroSectionProps) {
  const quickAmounts = [500, 1000, 2500, 5000];

  return (
    <section className="relative bg-[#FCFBF8] pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E8E5DE] overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Headlines & Action (Editorial Typography) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Small Label Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#F5F2EA] border border-[#E8E5DE] text-[#172B4D] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#10C9D4]" />
              <span>Registered Healthcare & Educational Charitable Trust</span>
            </div>

            {/* Expressive Editorial Headline: "Small Acts. Greater Impact." */}
            <h1 className="text-4xl sm:text-5xl lg:text-[70px] font-extrabold tracking-tight text-[#172B4D] leading-[1.08] font-heading">
              Small Acts.<br />
              <span className="text-[#087FC1]">Greater Impact.</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg lg:text-[19px] text-[#73777D] max-w-xl leading-relaxed font-body">
              {content.hero_subheadline ||
                'Together, we can bring hope, opportunity and meaningful change to the communities that need it most.'}
            </p>

            {/* Button System: Primary Ocean Blue & Secondary Navy Outline */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/donate"
                className="inline-flex items-center justify-center px-8 h-[52px] rounded-xl text-base font-semibold text-white bg-[#087FC1] hover:bg-[#076ea7] shadow-subtle hover:shadow-warm transition-all duration-200"
              >
                <Heart className="w-4 h-4 mr-2.5 fill-white" />
                {content.hero_cta_primary_text || 'Donate Now'}
              </Link>

              <a
                href="#our-work"
                className="inline-flex items-center justify-center px-7 h-[52px] rounded-xl text-base font-semibold text-[#172B4D] bg-transparent border border-[#172B4D] hover:bg-[#172B4D] hover:text-white transition-all duration-200 group"
              >
                <span>{content.hero_cta_secondary_text || 'Explore Our Work'}</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Quick Donation Selector */}
            <div className="pt-4 border-t border-[#E8E5DE] space-y-2.5">
              <span className="text-xs font-semibold text-[#73777D] uppercase tracking-wider block">
                Quick Contribution Options:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {quickAmounts.map((amt) => (
                  <Link
                    key={amt}
                    href={`/donate?amount=${amt}`}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E8E5DE] hover:border-[#087FC1] hover:text-[#087FC1] text-xs font-bold text-[#292D32] shadow-subtle transition"
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </Link>
                ))}
                <Link
                  href="/donate"
                  className="text-xs font-medium text-[#087FC1] hover:underline ml-1"
                >
                  or custom amount →
                </Link>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#73777D] pt-1">
              <span className="flex items-center">
                <Check className="w-4 h-4 text-[#087FC1] mr-1.5 shrink-0" />
                Deed Reg. No. 878 / 2023
              </span>
              <span className="flex items-center">
                <Check className="w-4 h-4 text-[#087FC1] mr-1.5 shrink-0" />
                Provisional 12A & 80G Approvals
              </span>
              <span className="flex items-center">
                <Check className="w-4 h-4 text-[#087FC1] mr-1.5 shrink-0" />
                100% Directed to Field Projects
              </span>
            </div>

          </div>

          {/* Right Column: Authentic Photography with Editorial Framing */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Asymmetrical Warm Neutral Backing Plate */}
              <div className="absolute -inset-3 bg-[#F5F2EA] rounded-2xl transform rotate-1 hidden sm:block border border-[#E8E5DE]" />

              {/* Main Photo Card */}
              <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E8E5DE] shadow-warm aspect-[4/3.2]">
                <Image
                  src={content.hero_image_url || '/images/activity/children-drive.jpg'}
                  alt={`${ngo.name} community outreach`}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Natural documentary caption overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#172B4D]/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F28C28] text-white mb-1 shadow-subtle">
                    Grassroots Field Initiative
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-snug text-[#FCFBF8]">
                    {ngo.slug === 'the-crawl-foundation' 
                      ? 'Field learning & nutrition drive with children in Dehradun, led by Mrs. Vimmy Kaul & volunteers.' 
                      : `${ngo.name} grassroots community empowerment and field outreach programs.`}
                  </p>
                </div>
              </div>

              {/* Minimal Information Block */}
              <div className="mt-4 bg-white rounded-xl p-3.5 border border-[#E8E5DE] shadow-subtle flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F2EA] text-[#087FC1] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#172B4D]">Direct Field Delivery</div>
                    <div className="text-[11px] text-[#73777D]">Dehradun & surrounding foothill areas</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#172B4D]">150+</span>
                  <span className="block text-[10px] text-[#73777D]">Children Supported</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
