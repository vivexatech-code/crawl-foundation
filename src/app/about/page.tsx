import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrustTransparencyBanner from '@/components/TrustTransparencyBanner';
import LeadershipSection from '@/components/LeadershipSection';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';
import { Heart, Compass, Target, Award, Shield } from 'lucide-react';

interface PageProps {
  searchParams?: { ngo?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const siteData = await getNgoFullSiteData(searchParams?.ngo);
  if (!siteData) return { title: 'About Us' };
  return {
    title: `About Us | ${siteData.ngo.name}`,
    description: siteData.ngo.short_description,
  };
}

export default async function RootAboutPage({ searchParams }: PageProps) {
  const siteData = await getNgoFullSiteData(searchParams?.ngo);

  if (!siteData) {
    notFound();
  }

  const { ngo, settings, homepage, team } = siteData;

  const coreValues = [
    {
      title: 'Grassroots Compassion',
      desc: 'We operate directly on the ground in underserved communities, listening to families and delivering tangible care.',
      icon: Heart,
      color: 'bg-[#F28C28]/10 text-[#F28C28]',
    },
    {
      title: 'Statutory Transparency',
      desc: 'Every donation is accounted for with formal receipts, registered under statutory regulations with transparent reporting.',
      icon: Shield,
      color: 'bg-[#087FC1]/10 text-[#087FC1]',
    },
    {
      title: 'Child Welfare & Education',
      desc: 'Committed to breaking generational cycles through foundational learning, stationery packs, and holistic support.',
      icon: Award,
      color: 'bg-[#F5C518]/15 text-[#172B4D]',
    },
    {
      title: 'Community Empowerment',
      desc: 'Empowering women and youth with healthcare guidance, essential nutrition, and sustainable self-reliance initiatives.',
      icon: Target,
      color: 'bg-[#10C9D4]/15 text-[#172B4D]',
    },
  ];

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#FCFBF8] text-[#292D32] selection:bg-[#087FC1] selection:text-white"
      style={{
        // @ts-ignore
        '--ngo-primary': ngo.primary_color || '#087FC1',
        '--ngo-secondary': ngo.secondary_color || '#ea580c',
        '--ngo-accent': ngo.accent_color || '#10C9D4',
      }}
    >
      <Navbar ngo={ngo} />

      <main className="flex-1">
        {/* Editorial Page Header */}
        <section className="bg-[#F5F2EA] py-16 lg:py-20 border-b border-[#E8E5DE]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-left max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] bg-white px-3 py-1 rounded-md border border-[#E8E5DE]">
              About Our Organization
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#172B4D] mt-4 tracking-tight font-heading">
              Dedicated to Compassion, Dignity & Lasting Social Impact.
            </h1>
            <p className="text-base text-[#73777D] mt-4 leading-relaxed font-body">
              {ngo.short_description ||
                'Working directly on the ground to provide educational support, healthcare assistance, and essential relief to underserved communities.'}
            </p>
          </div>
        </section>

        {/* Narrative Section */}
        <section className="py-16 sm:py-20 bg-[#FCFBF8]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-left space-y-6 text-[#292D32]">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172B4D] font-heading">
                Our Foundation & Purpose
              </h2>
              <p className="text-base leading-relaxed text-slate-700">
                {ngo.full_description || ngo.short_description}
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision Detailed */}
        <section className="py-16 bg-[#F5F2EA] border-y border-[#E8E5DE]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-white rounded-xl p-8 border border-[#E8E5DE] shadow-subtle">
                <div className="w-11 h-11 rounded-lg bg-[#087FC1]/10 text-[#087FC1] flex items-center justify-center mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#172B4D] mb-2 font-heading">Our Mission</h3>
                <p className="text-sm text-[#73777D] leading-relaxed font-body">
                  {homepage.mission_statement}
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-[#E8E5DE] shadow-subtle">
                <div className="w-11 h-11 rounded-lg bg-[#F28C28]/10 text-[#F28C28] flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#172B4D] mb-2 font-heading">Our Vision</h3>
                <p className="text-sm text-[#73777D] leading-relaxed font-body">
                  {homepage.vision_statement}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 sm:py-20 bg-[#FCFBF8]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-14 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] bg-[#087FC1]/10 px-3 py-1 rounded-md">
                Guiding Principles
              </span>
              <h2 className="text-3xl font-bold text-[#172B4D] mt-3 tracking-tight font-heading">
                Our Core Values
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="p-6 rounded-xl bg-white border border-[#E8E5DE] shadow-subtle hover:shadow-warm transition duration-200">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${v.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-[#172B4D] mb-2 font-heading">{v.title}</h4>
                    <p className="text-xs text-[#73777D] leading-relaxed font-body">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <LeadershipSection ngo={ngo} team={team} />

        {/* Trust & Transparency Banner */}
        <TrustTransparencyBanner settings={settings} />

      </main>

      <Footer ngo={ngo} settings={settings} />
    </div>
  );
}
