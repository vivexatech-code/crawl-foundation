import { redirect } from 'next/navigation';

export default function RootDynamicPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }; 
  searchParams?: { ngo?: string }; 
}) {
  const targetSlug = searchParams?.ngo || 'the-crawl-foundation';
  redirect(`/site/${targetSlug}/${params.slug}`);
}
