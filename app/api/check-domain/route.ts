import whois from 'whois-parsed';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// Simple in-memory store for rate limiting
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 100;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (now - record.timestamp > WINDOW_MS) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Get client IP
    const headersList = headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 });
    }

    const result = await whois.lookup(domain);

    return NextResponse.json({
      domain,
      data: result,
    });
  } catch (err: any) {
    console.error(`Error checking ${new URL(request.url).searchParams.get('domain')}:`, err);
    return NextResponse.json({
      domain: new URL(request.url).searchParams.get('domain'),
      data: {
        domainName: new URL(request.url).searchParams.get('domain'),
        isAvailable: false,
        status: err.message,
      },
    });
  }
}
