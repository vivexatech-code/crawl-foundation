import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrustTransparencyBanner from '@/components/TrustTransparencyBanner';
import LeadershipSection from '@/components/LeadershipSection';
import UnconfiguredDomainScreen from '@/components/UnconfiguredDomainScreen';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';
import { db } from '@/lib/db';
import { Heart, Compass, Target, CheckCircle2, Award, Shield } from 'lucide-react';

interface PageProps {
  searchParams: { ngo?: string };
}

export default async function AboutPage({ searchParams }: PageProps) {
  const ngoSlug = searchParams?.ngo;
  const siteData = await getNgoFullSiteData(ngoSlug);

  if (!siteData) {
    return <UnconfiguredDomainScreen />;
  }

  const { ngo, settings, homepage, team } = siteData;

  const coreValues = [
    {
      title: 'Grassroots Compassion',
      desc: 'We operate directly on the ground in underserved settlements, listening to families and delivering tangible care.',
      icon: Heart,
      color: 'bg-[#F28C28]/10 text-[#F28C28]',
    },
    {
      title: 'Statutory Transparency',
      desc: 'Every donation is accounted for with formal receipts, registered under Indian Trusts Act with provisional 12A & 80G approvals.',
      icon: Shield,
      color: 'bg-[#087FC1]/10 text-[#087FC1]',
    },
    {
      title: 'Child Welfare & Education',
      desc: 'Committed to breaking the generational cycle of poverty through foundational learning, notebooks, and coaching.',
      icon: Award,
      color: 'bg-[#F5C518]/15 text-[#172B4D]',
    },
    {
      title: 'Community Empowerment',
      desc: 'Empowering women and youth with healthcare guidance, essential nutrition, and self-reliance initiatives.',
      icon: Target,
      color: 'bg-[#10C9D4]/15 text-[#172B4D]',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF8] text-[#292D32] selection:bg-[#087FC1] selection:text-white">
      <Navbar ngo={ngo} />

      <main className="flex-1">
        {/* Editorial Page Header */}
        <section className="bg-[#F5F2EA] py-16 lg:py-20 border-b border-[#E8E5DE]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-left max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] bg-white px-3.5 py-1.5 rounded-md border border-[#E8E5DE] shadow-subtle">
              About Our Trust
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#172B4D] mt-4 tracking-tight font-heading leading-tight">
              Dedicated to Uplifting Lives with Compassion & Care
            </h1>
            <p className="text-base sm:text-lg text-[#73777D] mt-4 leading-relaxed font-body">
              Formed on 1st June 2023 in Dehradun, Uttarakhand, The Crawl Foundation is a recognized Healthcare and Educational Charitable Trust.
            </p>
          </div>
        </section>

        {/* Our Story & Founding History */}
        <section className="py-16 sm:py-20 bg-[#FCFBF8]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28] bg-[#F28C28]/10 px-3 py-1 rounded-md">
                  Founding History
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#172B4D] tracking-tight font-heading">
                  Bridging Gaps in Grassroots Welfare
                </h2>
                <p className="text-sm text-[#292D32] leading-relaxed font-body">
                  The Crawl Foundation was conceived by <strong>Mr. Ritesh Butola</strong> (Permanent Settlor & President), <strong>Mrs. Vimmy Kaul</strong> (Founder Trustee & Associate President), and <strong>Ms. Vartika Butola</strong> (Founder Trustee & Associate President) with a single core mission: to address the acute lack of foundational learning and healthcare assistance among children living in marginalized settlements of Dehradun.
                </p>
                <p className="text-sm text-[#73777D] leading-relaxed font-body">
                  On 1st June 2023, the formal Deed of Trust (Reg. No. 878 / 2023) was executed and registered at Sub-Registrar IV, Dehradun. The foundation’s governing deed establishes an irrevocable healthcare and educational charity dedicated to child care, medical relief, nutrition support, and community welfare without discrimination of religion, caste, or background.
                </p>

                <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-semibold text-[#172B4D]">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    <span>Incorporated: 01 June 2023</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                    <span>Dehradun Jurisdiction</span>
                  </div>
                </div>
              </div>

              {/* Photo Showcase */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-warm border border-[#E8E5DE] aspect-[4/3] bg-[#F5F2EA]">
                  <Image
                    src="/images/activity/children-drive.jpg"
                    alt="The Crawl Foundation community drive with children in Dehradun"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172B4D]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                    <span className="font-bold text-[#F5C518]">Dehradun Settlement Outreach:</span> Foundational learning and nutrition distribution.
                  </div>
                </div>
              </div>

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
