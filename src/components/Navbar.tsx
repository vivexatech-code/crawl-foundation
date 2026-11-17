'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Heart, Menu, X, ShieldCheck } from 'lucide-react';
import { NGO } from '@/types/database';

interface NavbarProps {
  ngo: NGO;
}

export default function Navbar({ ngo }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const basePath = `/site/${ngo.slug}`;

  const navLinks = [
    { name: 'Home', href: `${basePath}` },
    { name: 'About Us', href: `${basePath}/about` },
    { name: 'Our Work', href: `${basePath}/activities` },
    { name: 'Gallery', href: `${basePath}/gallery` },
    { name: 'Contact', href: `${basePath}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FCFBF8]/95 backdrop-blur-md border-b border-[#E8E5DE] transition-all">
      {/* Top Statutory Verification Bar (Deep Navy: #172B4D) */}
      <div className="bg-[#172B4D] text-[#FCFBF8] text-xs py-1.5 px-4 border-b border-[#172B4D]/20">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#10C9D4]/15 text-[#10C9D4] border border-[#10C9D4]/30">
              <ShieldCheck className="w-3 h-3 mr-1 inline" /> Verified Charitable Organization
            </span>
            <span className="hidden sm:inline text-[#F5F2EA]/85">
              {ngo.legal_name || ngo.name} • {ngo.tagline}
            </span>
            <span className="sm:hidden text-[#F5F2EA]/85 truncate max-w-[200px]">
              {ngo.name}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Link href={basePath} className="flex items-center space-x-3.5 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#E8E5DE] shadow-subtle group-hover:scale-102 transition-transform duration-200 bg-white">
              <Image
                src={ngo.logo_url || '/images/brand/logo.jpg'}
                alt={`${ngo.name} Logo`}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#172B4D] group-hover:text-[#087FC1] transition font-heading">
                {ngo.name}
              </span>
              <span className="block text-[11px] font-semibold text-[#73777D] tracking-wider uppercase">
                {ngo.tagline ? ngo.tagline.slice(0, 35) : 'Charitable Organization'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition duration-200 relative py-1 ${
                    active
                      ? 'text-[#087FC1] font-semibold'
                      : 'text-[#292D32] hover:text-[#087FC1]'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#087FC1] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Donate CTA */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link
              href={`${basePath}/donate`}
              className="inline-flex items-center justify-center px-6 h-[48px] rounded-xl text-sm font-bold text-white bg-[#087FC1] hover:bg-[#076ea7] shadow-subtle hover:shadow-warm transition-all duration-200"
            >
              <Heart className="w-4 h-4 mr-2 fill-white" />
              Donate Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href={`${basePath}/donate`}
              className="inline-flex items-center px-3.5 h-[38px] rounded-lg text-xs font-bold text-white bg-[#087FC1]"
            >
              <Heart className="w-3.5 h-3.5 mr-1 fill-white" />
              Donate
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#292D32] hover:text-[#172B4D] hover:bg-[#F5F2EA] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FCFBF8] border-b border-[#E8E5DE] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    active ? 'bg-[#F5F2EA] text-[#087FC1] font-bold' : 'text-[#292D32] hover:bg-[#F5F2EA]/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href={`${basePath}/donate`}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center h-[48px] rounded-xl text-sm font-bold text-white bg-[#087FC1] hover:bg-[#076ea7] shadow-sm"
              >
                <Heart className="w-4 h-4 mr-2 fill-white" />
                Make a Donation
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
