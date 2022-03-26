import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

export default async function middleware(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const pathName = req.nextUrl.pathname;
  const splitPath = pathName.split('/');
  const token = req.cookies.token;

  try {
    // Khusus halaman /admin/* atau /login
    if (splitPath[1] === 'admin' || pathName === '/login') {
      if (!process.env.PUBLIC_KEY) throw new Error('Public key not found');
      if (!token)
        return splitPath[1] === 'admin'
          ? NextResponse.redirect(`${origin}/login`)
          : NextResponse.next();

      const publicKey = await jose.importSPKI(process.env.PUBLIC_KEY, 'RS256');
      await jose.jwtVerify(token, publicKey);

      return splitPath[1] === 'admin'
        ? NextResponse.next()
        : NextResponse.redirect(`${origin}/admin/projects`);
    } else return NextResponse.next();
  } catch (err) {
    if (err instanceof jose.errors.JWTInvalid) {
      return NextResponse.redirect(`${origin}/login`);
    }

    console.log(`\n\n\nerror: `);
    console.log(err);
    return new Response(
      JSON.stringify({
        errors: [
          {
            title: 'error on server',
            detail: 'error on server',
            status: '401',
          },
        ],
      }),
      {
        status: 401,
        headers: {
          'content-type': 'application/vnd.api+json',
        },
      },
    );
  }
}
