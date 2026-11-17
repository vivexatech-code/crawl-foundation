'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, Shield, CheckCircle2 } from 'lucide-react';
import { TeamMember, NGO } from '@/types/database';

interface LeadershipSectionProps {
  ngo: NGO;
  team: TeamMember[];
}

export default function LeadershipSection({ team }: LeadershipSectionProps) {
  const trustees = team.filter((t) => t.category === 'trustee' || t.is_published);

  return (
    <section className="py-16 sm:py-24 bg-[#F5F2EA]/40 border-b border-[#E8E5DE] relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14 text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] bg-[#087FC1]/10 px-3 py-1 rounded-md">
            Governance & Integrity
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#172B4D] mt-3 tracking-tight font-heading">
            Board of Permanent Trustees
          </h2>
          <p className="text-base text-[#73777D] mt-3 leading-relaxed font-body">
            As constituted under the registered Deed of Trust (Reg. No. 878 / 2023, Dehradun), our board stewards public trust, statutory compliance, and grassroots programs.
          </p>
        </div>

        {/* Trustees Grid (Editorial Portrait Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustees.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl overflow-hidden border border-[#E8E5DE] shadow-subtle hover:shadow-warm transition-all duration-200 flex flex-col group"
            >
              {/* Authentic Photo with Professional Documentary Aspect Ratio */}
              <div className="relative h-72 w-full bg-[#F5F2EA] overflow-hidden">
                <Image
                  src={member.image_url || '/images/team/vimmy-kaul.jpg'}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                />
                
                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#172B4D] shadow-subtle border border-[#E8E5DE]">
                    <Shield className="w-3 h-3 mr-1 text-[#087FC1]" /> Permanent Trustee
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#172B4D] group-hover:text-[#087FC1] transition font-heading">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#F28C28] mt-0.5">
                    {member.role}
                  </p>
                  <p className="text-xs text-[#73777D] mt-3 leading-relaxed font-body">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E8E5DE] flex items-center justify-between text-xs text-[#73777D]">
                  <span className="flex items-center text-emerald-700 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified by Trust Deed
                  </span>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-1.5 rounded-lg bg-[#F5F2EA] hover:bg-[#E8E5DE] text-[#292D32] transition"
                      title={member.email}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {trustees.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E8E5DE] p-10 text-center max-w-xl mx-auto shadow-subtle my-6">
            <Shield className="w-10 h-10 text-[#73777D] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#172B4D] font-heading">Board of Trustees</h3>
            <p className="text-xs text-[#73777D] mt-1.5 leading-relaxed font-body">
              Official governance profiles are maintained under statutory trust registrations.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
