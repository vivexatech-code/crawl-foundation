import { redirect } from 'next/navigation';

export default function RootPrivacyPolicyPage({ searchParams }: { searchParams?: { ngo?: string } }) {
  const targetSlug = searchParams?.ngo || 'the-crawl-foundation';
  redirect(`/site/${targetSlug}/privacy-policy`);
}
