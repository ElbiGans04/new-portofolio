import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const method = req.method;
  // const urlPath = req.nextUrl.pathname;
  const contentType = req.headers.get('content-type');

  // Jika method get maka langsung lewatkan
  if (method === 'GET') return NextResponse.next();

  // Jika method selain dibawah maka kembalikan error
  if (method !== 'POST' && method !== 'PATCH' && method !== 'DELETE') {
    return new Response(
      JSON.stringify({
        errors: [
          {
            title: 'method not found',
            detail: 'method not support by server',
            status: '406',
          },
        ],
      }),
      {
        status: 406,
        headers: {
          'content-type': 'application/vnd.api+json',
        },
      },
    );
  }

  if (method !== 'DELETE' && contentType !== 'application/vnd.api+json') {
    return new Response(
      JSON.stringify({
        errors: [
          {
            title: 'headers not support',
            detail:
              'please body only with content-type: application/vnd.api+json',
            status: '406',
          },
        ],
      }),
      {
        status: 406,
        headers: {
          'content-type': 'application/vnd.api+json',
        },
      },
    );
  }

  return NextResponse.next();
}
