import { NextResponse } from 'next/server';
import type { DomainPrice } from '@/types/domain';

// Ensure route is not statically optimized
export const dynamic = 'force-dynamic';

interface PorkbunResponse {
  status: string;
  message?: string;
  response: {
    avail: string;
    type: string;
    price: string;
    firstYearPromo: string;
    regularPrice: string;
    premium: string;
    additional: {
      renewal: {
        type: string;
        price: string;
        regularPrice: string;
      };
      transfer: {
        type: string;
        price: string;
        regularPrice: string;
      };
    };
  };
}

async function checkDomainPrice(domain: string): Promise<PorkbunResponse> {
  const apiKey = process.env.NEXT_PUBLIC_PORKBUN_API_KEY;
  const secretApiKey = process.env.NEXT_PUBLIC_PORKBUN_SECRET_API_KEY;

  if (!apiKey || !secretApiKey) {
    throw new Error('Porkbun API credentials are not configured');
  }

  const response = await fetch(`https://api.porkbun.com/api/json/v3/domain/checkDomain/${domain}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apikey: apiKey,
      secretapikey: secretApiKey,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `API error: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  return data;
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');
  const isAvailable = searchParams.get('available') === 'true';

  if (!domain) {
    return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 });
  }

  if (!isAvailable) {
    return NextResponse.json({ error: 'Domain is not available' }, { status: 404 });
  }

  try {
    const porkbunResponse = await checkDomainPrice(domain);

    if (porkbunResponse.status !== 'SUCCESS') {
      throw new Error(porkbunResponse.message || 'Failed to check domain price');
    }

    // Double-check availability from Porkbun's response
    if (porkbunResponse.response.avail === 'no') {
      return NextResponse.json(
        { error: 'Domain is not available for registration' },
        { status: 404 }
      );
    }

    // Convert Porkbun response to our DomainPrice format
    const price: DomainPrice = {
      registration: Number(porkbunResponse.response.price) || 0,
      renewal: Number(porkbunResponse.response.additional.renewal.price) || 0,
      transfer: Number(porkbunResponse.response.additional.transfer.price) || 0,
      isPremium: porkbunResponse.response.premium === 'yes',
      currency: 'USD',
    };

    return NextResponse.json(price);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch domain price' },
      { status: 500 }
    );
  }
}
