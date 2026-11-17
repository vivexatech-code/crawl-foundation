'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Mail, Phone, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { NGO, SiteSettings } from '@/types/database';

interface FooterProps {
  ngo: NGO;
  settings: SiteSettings;
}

export default function Footer({ ngo, settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#172B4D] text-[#FCFBF8] pt-16 pb-12 border-t border-[#172B4D]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info (Cols 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border border-[#E8E5DE] shadow-subtle shrink-0">
                <Image
                  src={ngo.logo_url || '/images/brand/logo.jpg'}
                  alt={ngo.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight font-heading">{ngo.name}</span>
                <span className="block text-xs text-[#10C9D4] font-semibold">
                  Healthcare & Educational Charitable Trust
                </span>
              </div>
            </div>

            <p className="text-xs text-[#F5F2EA]/80 leading-relaxed font-body">
              {ngo.short_description ||
                'A registered charitable trust in Dehradun dedicated to child education, healthcare support, women empowerment, and poor relief with utmost transparency.'}
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-[#FCFBF8] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#10C9D4]" />
                <span>Reg. No. 878 / 2023 • Sub-Registrar IV, Dehradun</span>
              </div>
            </div>
          </div>

          {/* Quick Links (Cols 5-7) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/?ngo=${ngo.slug}`} className="text-[#F5F2EA]/80 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href={`/about?ngo=${ngo.slug}`} className="text-[#F5F2EA]/80 hover:text-white transition">About Our Trust</Link>
              </li>
              <li>
                <Link href={`/activities?ngo=${ngo.slug}`} className="text-[#F5F2EA]/80 hover:text-white transition">Field Initiatives & Drives</Link>
              </li>
              <li>
                <Link href={`/gallery?ngo=${ngo.slug}`} className="text-[#F5F2EA]/80 hover:text-white transition">Photo Gallery</Link>
              </li>
              <li>
                <Link href={`/contact?ngo=${ngo.slug}`} className="text-[#F5F2EA]/80 hover:text-white transition">Contact & Volunteer</Link>
              </li>
              <li>
                <Link href={`/donate?ngo=${ngo.slug}`} className="text-[#F5C518] font-bold hover:underline transition inline-flex items-center">
                  <Heart className="w-3 h-3 mr-1 fill-[#F5C518] inline" /> Make a Donation
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Transparency & Approvals (Cols 8-9) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">Registrations</h4>
            <div className="space-y-2 text-xs text-[#F5F2EA]/80">
              <div>
                <span className="block text-[10px] text-[#F5F2EA]/60 uppercase">Section 12A URN:</span>
                <span className="font-mono text-white text-[11px]">{settings.section_12a_urn || 'AAVFT8621RE20251'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#F5F2EA]/60 uppercase">Section 80G URN:</span>
                <span className="font-mono text-white text-[11px]">{settings.section_80g_urn || 'AAVFT8621RF20251'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#F5F2EA]/60 uppercase">Provisional Validity:</span>
                <span className="text-[11px] text-[#F5F2EA]">AY 2026-27 to 2028-29</span>
              </div>
              <div className="pt-2">
                <Link href={`/privacy-policy?ngo=${ngo.slug}`} className="block text-[#F5F2EA]/70 hover:text-white transition text-[11px]">Privacy Policy</Link>
                <Link href={`/refund-policy?ngo=${ngo.slug}`} className="block text-[#F5F2EA]/70 hover:text-white transition text-[11px] mt-1">Refund & Donation Policy</Link>
                <Link href={`/terms-conditions?ngo=${ngo.slug}`} className="block text-[#F5F2EA]/70 hover:text-white transition text-[11px] mt-1">Terms & Conditions</Link>
              </div>
            </div>
          </div>

          {/* Registered Office & Contact (Cols 10-12) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-heading">Registered Office</h4>
            
            <div className="space-y-2 text-xs text-[#F5F2EA]/80">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#10C9D4] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings.registered_address}</span>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <Mail className="w-4 h-4 text-[#10C9D4] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition">{settings.email}</a>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#10C9D4] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition">{settings.phone}</a>
              </div>

              {settings.google_maps_url && (
                <div className="pt-2">
                  <a
                    href={settings.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-[#10C9D4] hover:underline font-semibold"
                  >
                    <span>View on Google Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F5F2EA]/60 gap-4">
          <p>© {currentYear} {ngo.legal_name}. All rights reserved.</p>
          <p className="text-center sm:text-right text-[11px]">
            Managed via Centralized NGO CMS • 256-Bit SSL Secured
          </p>
        </div>

      </div>
    </footer>
  );
}
