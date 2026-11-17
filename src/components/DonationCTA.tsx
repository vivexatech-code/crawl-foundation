'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { HomepageContent, NGO } from '@/types/database';

interface DonationCTAProps {
  ngo: NGO;
  content: HomepageContent;
}

export default function DonationCTA({ ngo, content }: DonationCTAProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const amounts = [500, 1000, 2500, 5000];

  return (
    <section className="py-16 sm:py-24 bg-[#172B4D] text-[#FCFBF8] relative overflow-hidden border-b border-[#172B4D]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Label Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-lg bg-white/10 text-[#FCFBF8] text-xs font-semibold mb-4 border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-[#F5C518]" />
          <span>Direct Grassroots Deployment</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white font-heading max-w-3xl mx-auto">
          {content.cta_banner_title || 'Your Contribution Can Change a Life.'}
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#F5F2EA]/85 max-w-2xl mx-auto mt-4 leading-relaxed font-body">
          {content.cta_banner_subtitle ||
            'Support child education, healthcare drives, and immediate relief kits. Transparently accounted and directly deployed on the ground in Dehradun.'}
        </p>

        {/* Amount Selector Pills */}
        <div className="mt-8 max-w-lg mx-auto bg-white/10 p-2 rounded-xl border border-white/15 flex flex-wrap items-center justify-center gap-2">
          {amounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setSelectedAmount(amt)}
              className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                selectedAmount === amt
                  ? 'bg-[#087FC1] text-white shadow-subtle'
                  : 'text-[#FCFBF8] hover:bg-white/10'
              }`}
            >
              ₹{amt.toLocaleString('en-IN')}
            </button>
          ))}
        </div>

        {/* Impact Note for Selected Amount */}
        <div className="mt-3 text-xs text-[#F5F2EA]/80 font-medium">
          {selectedAmount === 500 && '₹500 sponsors essential learning workbooks & stationery for 2 children.'}
          {selectedAmount === 1000 && '₹1,000 provides wholesome nutrition and pediatric medical checkups for 4 children.'}
          {selectedAmount === 2500 && '₹2,500 funds comprehensive learning kit and winter thermal warmth for 5 children.'}
          {selectedAmount === 5000 && '₹5,000 supports an entire community learning & healthcare cluster for a month.'}
        </div>

        {/* Main CTA Button: Ocean Blue with Medium Rounded Corners (~52px height) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/site/${ngo.slug}/donate?amount=${selectedAmount}`}
            className="w-full sm:w-auto inline-flex items-center justify-center px-10 h-[52px] rounded-xl text-base font-bold text-white bg-[#087FC1] hover:bg-[#076ea7] shadow-warm transition-all duration-200"
          >
            <Heart className="w-4 h-4 mr-2.5 fill-white" />
            {content.cta_banner_button_text || 'Make a Donation'}
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#F5F2EA]/75 pt-4 border-t border-white/10">
          <span className="flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1 text-[#10C9D4]" /> 256-Bit SSL Razorpay Encryption
          </span>
          <span className="flex items-center">
            <Check className="w-4 h-4 mr-1 text-[#10C9D4]" /> Instant 80G Compliant Digital Receipt
          </span>
          <span className="flex items-center">
            <Check className="w-4 h-4 mr-1 text-[#10C9D4]" /> Registered Trust (Deed No. 878 / 2023)
          </span>
        </div>

      </div>
    </section>
  );
}
