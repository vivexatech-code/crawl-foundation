import { NextResponse } from 'next/server';
import { getNgoFullSiteData } from '@/lib/ngo-tenant';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('ngo') || undefined;
    const data = await getNgoFullSiteData(slug);
    if (!data) {
      return NextResponse.json({ error: 'Domain or NGO not configured on this platform' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch site data' }, { status: 500 });
  }
}
