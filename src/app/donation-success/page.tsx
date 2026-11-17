import { redirect } from 'next/navigation';

export default function RootDonationSuccessPage({ 
  searchParams 
}: { 
  searchParams?: { ngo?: string; id?: string; receipt?: string }; 
}) {
  const targetSlug = searchParams?.ngo || 'the-crawl-foundation';
  const queryParams = new URLSearchParams();
  if (searchParams?.id) queryParams.set('id', searchParams.id);
  if (searchParams?.receipt) queryParams.set('receipt', searchParams.receipt);
  const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';
  redirect(`/site/${targetSlug}/donation-success${qs}`);
}
