import whois from 'whois-parsed';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 });
  }

  try {
    console.log('Checking domain with whois:', domain);

    const result = await whois.lookup(domain);

    return NextResponse.json({
      domain,
      data: result,
    });
  } catch (err: any) {
    console.error(`Error checking ${domain}:`, err);
    return NextResponse.json({
      domain,
      data: {
        domainName: domain,
        isAvailable: false,
        status: err.message,
      },
    });
  }
}
