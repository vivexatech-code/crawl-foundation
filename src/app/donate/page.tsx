import { redirect } from 'next/navigation';

export default function RootDonatePage({ searchParams }: { searchParams?: { ngo?: string; amount?: string } }) {
  const targetSlug = searchParams?.ngo || 'the-crawl-foundation';
  const query = searchParams?.amount ? `?amount=${encodeURIComponent(searchParams.amount)}` : '';
  redirect(`/site/${targetSlug}/donate${query}`);
}
