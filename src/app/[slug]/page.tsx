import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UnconfiguredDomainScreen from '@/components/UnconfiguredDomainScreen';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';
import { db } from '@/lib/db';
import { FileText, Calendar, CheckCircle } from 'lucide-react';

interface PageProps {
  params: { slug: string };
  searchParams: { ngo?: string };
}

export default async function DynamicCustomPage({ params, searchParams }: PageProps) {
  const ngoSlug = searchParams?.ngo;
  const siteData = await getNgoFullSiteData(ngoSlug);

  if (!siteData) {
    notFound();
  }

  const { ngo, settings } = siteData;
  const page = await db.getPageBySlug(ngo.id, params.slug);

  if (!page || !page.is_published) {
    notFound();
  }

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

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="border-b border-[#E8E5DE] pb-8 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087FC1] bg-[#087FC1]/10 px-3 py-1 rounded-md">
              {ngo.name}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B4D] mt-3 font-heading tracking-tight">
              {page.title}
            </h1>
            {page.excerpt && (
              <p className="text-base text-slate-600 mt-3 leading-relaxed">
                {page.excerpt}
              </p>
            )}
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-4">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published on {new Date(page.created_at).toLocaleDateString()}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-emerald-600 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Official Publication</span>
              </span>
            </div>
          </div>

          {/* Body Content */}
          <article className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line font-body">
            {page.content}
          </article>
        </div>
      </main>

      <Footer ngo={ngo} settings={settings} />
    </div>
  );
}
