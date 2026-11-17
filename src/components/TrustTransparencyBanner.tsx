'use client';

import React from 'react';
import { ShieldCheck, Award, FileText, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '@/types/database';

interface TrustTransparencyBannerProps {
  settings: SiteSettings;
}

export default function TrustTransparencyBanner({ settings }: TrustTransparencyBannerProps) {
  return (
    <section className="bg-[#F5F2EA] border-y border-[#E8E5DE] py-8 sm:py-10">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Header & Verification Badge */}
          <div className="flex items-start space-x-3 text-[#172B4D] max-w-md">
            <div className="w-10 h-10 rounded-xl bg-white text-[#087FC1] flex items-center justify-center shrink-0 border border-[#E8E5DE] shadow-subtle">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#172B4D]">
                  Statutory Transparency
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#10C9D4]/15 text-[#172B4D] border border-[#10C9D4]/30">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-[#087FC1]" /> Verified Legal Entity
                </span>
              </div>
              <p className="text-xs text-[#73777D] mt-1 leading-relaxed">
                Registered under the Indian Trusts Act with provisional tax exemptions granted by the Income Tax Department.
              </p>
            </div>
          </div>

          {/* Verification Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 lg:max-w-2xl">
            {/* Trust Registration */}
            <div className="bg-white border border-[#E8E5DE] rounded-xl p-3.5 shadow-subtle">
              <div className="flex items-center space-x-1.5 text-[#73777D] text-[11px] font-medium">
                <FileText className="w-3.5 h-3.5 text-[#087FC1]" />
                <span>Trust Registration</span>
              </div>
              <p className="text-xs font-bold text-[#172B4D] mt-1">
                {settings.trust_reg_number || 'Deed No. 878 / 2023'}
              </p>
              <p className="text-[10px] text-[#73777D]">Sub-Registrar IV, Dehradun</p>
            </div>

            {/* 12A Registration */}
            <div className="bg-white border border-[#E8E5DE] rounded-xl p-3.5 shadow-subtle">
              <div className="flex items-center space-x-1.5 text-[#73777D] text-[11px] font-medium">
                <Award className="w-3.5 h-3.5 text-[#087FC1]" />
                <span>Section 12A URN</span>
              </div>
              <p className="text-xs font-bold text-[#172B4D] mt-1 font-mono">
                {settings.section_12a_urn || 'AAVFT8621RE20251'}
              </p>
              <p className="text-[10px] text-[#73777D]">Provisional: AY 2026-27 to 2028-29</p>
            </div>

            {/* 80G Approval */}
            <div className="bg-white border border-[#E8E5DE] rounded-xl p-3.5 shadow-subtle">
              <div className="flex items-center space-x-1.5 text-[#73777D] text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#087FC1]" />
                <span>Section 80G URN</span>
              </div>
              <p className="text-xs font-bold text-[#172B4D] mt-1 font-mono">
                {settings.section_80g_urn || 'AAVFT8621RF20251'}
              </p>
              <p className="text-[10px] text-[#73777D]">Provisional: AY 2026-27 to 2028-29</p>
            </div>
          </div>

        </div>

        {/* Disclaimer Note */}
        <div className="mt-5 pt-3 border-t border-[#E8E5DE] text-[11px] text-[#73777D] text-left">
          <strong className="text-[#172B4D]">Statutory Compliance Disclosure:</strong> Provisional registration under Section 12A and provisional approval under Section 80G were issued by the Income Tax Department on 18-04-2025 for Assessment Years 2026-27 through 2028-29. Deductions are subject to the applicable conditions of the Income Tax Act, 1961.
        </div>
      </div>
    </section>
  );
}
