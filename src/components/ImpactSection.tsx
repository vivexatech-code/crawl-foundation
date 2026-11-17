'use client';

import React from 'react';
import { Users, CalendarCheck, PackageCheck, FileCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { HomepageContent } from '@/types/database';

interface ImpactSectionProps {
  content: HomepageContent;
}

const icons = [Users, CalendarCheck, PackageCheck, FileCheck];

export default function ImpactSection({ content }: ImpactSectionProps) {
  const hasStats = content.impact_stats && content.impact_stats.length > 0;

  return (
    <section className="py-16 sm:py-24 bg-[#FCFBF8] border-b border-[#E8E5DE] relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14 text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#F5F2EA] border border-[#E8E5DE] text-xs font-semibold text-[#172B4D] mb-3">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#087FC1]" />
            <span>Verified Field Metrics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#172B4D] tracking-tight font-heading">
            Measurable Community Impact
          </h2>
          <p className="text-base text-[#73777D] mt-3 leading-relaxed font-body">
            We believe that authentic charity is built on transparency. Every metric below represents confirmed field activities directly executed by our trustees and volunteers.
          </p>
        </div>

        {hasStats ? (
          /* Stats Grid: Editorial Soft Cream Cards with Playfair Serif Numerals */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.impact_stats.map((stat, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div
                  key={i}
                  className="bg-[#F5F2EA] border border-[#E8E5DE] rounded-xl p-6 hover:shadow-subtle transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-white text-[#087FC1] flex items-center justify-center mb-4 border border-[#E8E5DE] shadow-subtle">
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {/* Expressive Editorial Number */}
                  <div className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#172B4D] tracking-tight font-serif">
                    {stat.value}
                  </div>
                  
                  <div className="text-sm font-bold text-[#172B4D] mt-1 font-heading">
                    {stat.label}
                  </div>
                  
                  <p className="text-xs text-[#73777D] mt-1.5 leading-relaxed font-body">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* Transparent Empty State: No Fake Stats */
          <div className="bg-[#F5F2EA] border border-[#E8E5DE] rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-white text-[#087FC1] mx-auto flex items-center justify-center mb-4 border border-[#E8E5DE] shadow-subtle">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#172B4D] font-heading">
              Field Metrics Under Audit
            </h3>
            <p className="text-xs text-[#73777D] mt-2 max-w-md mx-auto leading-relaxed font-body">
              In accordance with our zero-fabrication transparency policy, field metrics and beneficiary counts are published exclusively upon quarterly Board of Trustees audit and statutory verification.
            </p>
          </div>
        )}

        {/* Verification Guarantee */}
        <div className="mt-10 pt-4 border-t border-[#E8E5DE] text-xs text-[#73777D] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Official Trust Documentation verified through Sub-Registrar IV, Dehradun. Zero fabricated statistics.</span>
          <span className="text-[#172B4D] font-semibold">Audited Field Operations</span>
        </div>

      </div>
    </section>
  );
}
