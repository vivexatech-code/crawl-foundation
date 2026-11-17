import { redirect } from 'next/navigation';

interface PageProps {
  searchParams?: { ngo?: string };
}

export default function RootHomePage({ searchParams }: PageProps) {
  const targetSlug = searchParams?.ngo || 'the-crawl-foundation';
  redirect(`/site/${targetSlug}`);
}
