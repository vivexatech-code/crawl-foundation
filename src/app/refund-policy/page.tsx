import { redirect } from 'next/navigation';

export default function RootRefundPolicyPage({ searchParams }: { searchParams?: { ngo?: string } }) {
  const targetSlug = searchParams?.ngo || 'the-crawl-foundation';
  redirect(`/site/${targetSlug}/refund-policy`);
}
