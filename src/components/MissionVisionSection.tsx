'use client';

import React from 'react';
import { Target, Compass, BookOpen, Stethoscope, HeartHandshake, Sparkles } from 'lucide-react';
import { HomepageContent } from '@/types/database';

interface MissionVisionSectionProps {
  content: HomepageContent;
}

export default function MissionVisionSection({ content }: MissionVisionSectionProps) {
  const trustPillars = [
    {
      icon: BookOpen,
      title: 'Foundational Education',
      accentColor: 'text-[#087FC1] bg-[#087FC1]/10',
      description: 'Conducting remedial learning drives, distributing school bags, notebooks, and learning materials to children in Dehradun settlements.',
    },
    {
      icon: Stethoscope,
      title: 'Healthcare Assistance',
      accentColor: 'text-[#10C9D4] bg-[#10C9D4]/15',
      description: 'Extending pediatric medical checkups, primary healthcare aid, subsidized medicines, and treatment referrals for vulnerable families.',
    },
    {
      icon: HeartHandshake,
      title: 'Relief of the Poor',
      accentColor: 'text-[#F28C28] bg-[#F28C28]/10',
      description: 'Distributing wholesome meals, seasonal thermal winter blankets, protective clothing, and emergency aid during personal and community hardships.',
    },
    {
      icon: Sparkles,
      title: 'Women Empowerment',
      accentColor: 'text-[#172B4D] bg-[#172B4D]/10',
      description: 'Fostering vocational self-reliance, preventive maternal healthcare awareness, and dignity-focused community programs for women.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FCFBF8] relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] bg-[#087FC1]/10 px-3 py-1 rounded-md">
            Our Purpose & Core Objects
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#172B4D] mt-3 tracking-tight font-heading">
            Driven by Compassion, Guided by Purpose
          </h2>
          <p className="text-base text-[#73777D] mt-3 leading-relaxed font-body">
            Registered as a Healthcare and Educational Charitable Trust in Dehradun, our work is dedicated to delivering transparent, direct grassroots impact where it is needed most.
          </p>
        </div>

        {/* Mission & Vision: Two Visually Distinct Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Mission Card: Deep Navy with Cyan Accent */}
          <div className="relative rounded-2xl p-8 sm:p-10 bg-[#172B4D] text-[#FCFBF8] shadow-warm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#10C9D4] mb-6 border border-white/10">
                <Target className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[#10C9D4] block mb-2">
                {content.mission_title || 'Our Mission'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-heading">
                Direct Grassroots Action
              </h3>
              <p className="text-[#F5F2EA]/85 text-base leading-relaxed font-body">
                {content.mission_statement ||
                  'To empower underprivileged children with foundational education, provide accessible healthcare support, extend compassionate relief to the impoverished, and foster self-reliant communities free from discrimination.'}
              </p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-white/10 text-xs text-[#F5F2EA]/60 flex items-center justify-between">
              <span>Governed by Trust Deed No. 878 / 2023</span>
              <span className="text-[#10C9D4] font-semibold">Dehradun, UK</span>
            </div>
          </div>

          {/* Vision Card: Soft Cream with Deep Navy text & Warm Orange Accent */}
          <div className="relative rounded-2xl p-8 sm:p-10 bg-[#F5F2EA] border border-[#E8E5DE] shadow-subtle overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#F28C28] mb-6 border border-[#E8E5DE] shadow-subtle">
                <Compass className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28] block mb-2">
                {content.vision_title || 'Our Vision'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#172B4D] mb-4 font-heading">
                Dignity, Hope & Opportunity
              </h3>
              <p className="text-[#292D32] text-base leading-relaxed font-body">
                {content.vision_statement ||
                  'A society where every child enjoys the right to education, every vulnerable family has access to healthcare and dignity, and grassroots compassion fuels sustainable social change.'}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E8E5DE] text-xs text-[#73777D] flex items-center justify-between">
              <span>Humanitarian Commitment</span>
              <span className="text-[#172B4D] font-semibold">Equal Opportunity</span>
            </div>
          </div>

        </div>

        {/* 4 Pillars of Objects from Trust Deed */}
        <div>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#172B4D] font-heading">Core Charitable Objects</h3>
            <p className="text-xs text-[#73777D] mt-1">Formal charitable purposes established in our registered Trust Deed</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-[#E8E5DE] rounded-xl p-6 hover:shadow-warm transition-all duration-200"
                >
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${pillar.accentColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-[#172B4D] mb-2 font-heading">{pillar.title}</h4>
                  <p className="text-xs text-[#73777D] leading-relaxed font-body">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
