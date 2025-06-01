import whois from 'whois-parsed';
import { NextResponse } from 'next/server';
import rateLimit from 'express-rate-limit';

export const dynamic = 'force-dynamic';

// Create limiter instance
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 100, // limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again after an hour',
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  skipFailedRequests: false, // Don't count failed requests
});

// Wrapper for the rate limiter to work with Next.js Edge API routes
const applyRateLimit = (request: Request) =>
  new Promise((resolve, reject) => {
    const res = new NextResponse();
    limiter(
      Object.assign(request, {
        headers: Object.fromEntries(request.headers.entries()),
      }),
      res,
      (result: unknown) => {
        if (res.status === 429) {
          reject(res);
        } else {
          resolve(result);
        }
      }
    );
  });

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Apply rate limiting
    await applyRateLimit(request);

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
    if (err instanceof NextResponse && err.status === 429) {
      return err;
    }

    const domain = new URL(request.url).searchParams.get('domain');
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
