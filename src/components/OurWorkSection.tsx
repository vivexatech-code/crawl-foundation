'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, X, CheckCircle2, Clock } from 'lucide-react';
import { Activity, NGO } from '@/types/database';

interface OurWorkSectionProps {
  ngo: NGO;
  activities: Activity[];
}

export default function OurWorkSection({ ngo, activities }: OurWorkSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalActivity, setActiveModalActivity] = useState<Activity | null>(null);

  const categories = ['All', ...Array.from(new Set(activities.map((a) => a.category)))];

  const filteredActivities =
    selectedCategory === 'All'
      ? activities
      : activities.filter((a) => a.category === selectedCategory);

  return (
    <section id="our-work" className="py-16 sm:py-24 bg-[#F5F2EA]/60 border-b border-[#E8E5DE] relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] bg-[#087FC1]/10 px-3 py-1 rounded-md">
              Field Activities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#172B4D] mt-3 tracking-tight font-heading">
              Our Work on the Ground
            </h2>
            <p className="text-base text-[#73777D] mt-2 max-w-xl font-body">
              Authentic humanitarian initiatives conducted directly across Dehradun and surrounding Himalayan foothill communities.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
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

        {/* Activities Grid (Distinct Editorial Treatment) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((activity) => (
            <article
              key={activity.id}
              className="bg-white rounded-xl overflow-hidden border border-[#E8E5DE] shadow-subtle hover:shadow-warm transition-all duration-200 flex flex-col group"
            >
              {/* Image Container with Natural Proportions */}
              <div className="relative h-60 w-full overflow-hidden bg-[#F5F2EA]">
                <Image
                  src={activity.featured_image_url || '/images/activity/children-drive.jpg'}
                  alt={activity.title}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-300"
                />
                
                {/* Category & Status Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white text-[#172B4D] shadow-subtle border border-[#E8E5DE]">
                    {activity.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center ${
                      activity.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : activity.status === 'ongoing'
                        ? 'bg-[#087FC1] text-white'
                        : 'bg-[#F28C28] text-white'
                    }`}
                  >
                    {activity.status === 'completed' ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {activity.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Meta Details */}
                  <div className="flex items-center space-x-3 text-[11px] text-[#73777D] mb-2.5">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-[#73777D]" />
                      {activity.activity_date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center truncate">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[#73777D] shrink-0" />
                      {activity.location}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#172B4D] group-hover:text-[#087FC1] transition font-heading line-clamp-2">
                    {activity.title}
                  </h3>

                  <p className="text-xs text-[#73777D] mt-2.5 line-clamp-3 leading-relaxed font-body">
                    {activity.short_description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-[#E8E5DE] flex items-center justify-between">
                  <button
                    onClick={() => setActiveModalActivity(activity)}
                    className="text-xs font-bold text-[#087FC1] hover:text-[#076ea7] inline-flex items-center"
                  >
                    Read Details
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>

                  <Link
                    href="/donate"
                    className="text-[11px] font-semibold text-[#172B4D] hover:text-[#087FC1] px-2.5 py-1 rounded bg-[#F5F2EA] transition"
                  >
                    Support Drive →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E8E5DE] p-10 text-center max-w-xl mx-auto shadow-subtle my-6">
            <Calendar className="w-10 h-10 text-[#73777D] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#172B4D] font-heading">No Field Activities Listed</h3>
            <p className="text-xs text-[#73777D] mt-1.5 leading-relaxed font-body">
              Verified community drives and welfare initiatives for this category will appear here upon board approval.
            </p>
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href={`/activities?ngo=${ngo.slug}`}
            className="inline-flex items-center justify-center px-6 h-[48px] rounded-xl text-sm font-semibold text-[#172B4D] bg-white border border-[#172B4D] hover:bg-[#172B4D] hover:text-white shadow-subtle transition"
          >
            <span>View All Field Initiatives</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

      </div>

      {/* Activity Details Modal */}
      {activeModalActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B4D]/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E5DE] p-6 sm:p-8 relative">
            <button
              onClick={() => setActiveModalActivity(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-[#F5F2EA] hover:bg-[#E8E5DE] text-[#292D32] transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6 bg-[#F5F2EA]">
              <Image
                src={activeModalActivity.featured_image_url || '/images/activity/children-drive.jpg'}
                alt={activeModalActivity.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#F5F2EA] text-[#172B4D] border border-[#E8E5DE]">
                {activeModalActivity.category}
              </span>
              <span className="text-xs text-[#73777D] flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                {activeModalActivity.location}
              </span>
              <span className="text-xs text-[#73777D] flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {activeModalActivity.activity_date}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-[#172B4D] mb-4 font-heading">{activeModalActivity.title}</h3>
            
            <p className="text-sm text-[#292D32] leading-relaxed whitespace-pre-line mb-6 font-body">
              {activeModalActivity.full_content || activeModalActivity.short_description}
            </p>

            <div className="pt-4 border-t border-[#E8E5DE] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#73777D]">
                Managed by <strong>{ngo.name}</strong>
              </span>
              <Link
                href="/donate"
                onClick={() => setActiveModalActivity(null)}
                className="w-full sm:w-auto px-6 h-[44px] rounded-xl text-xs font-bold text-white bg-[#087FC1] hover:bg-[#076ea7] inline-flex items-center justify-center transition"
              >
                Donate for this Cause
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
