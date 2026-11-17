import { redirect } from 'next/navigation';

export default function RootGalleryPage({ searchParams }: { searchParams?: { ngo?: string } }) {
  const targetSlug = searchParams?.ngo || 'the-crawl-foundation';
  redirect(`/site/${targetSlug}/gallery`);
}
