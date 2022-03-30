import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import moment from 'moment';

export default async function middleware(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const pathName = req.nextUrl.pathname;
  const splitPath = pathName.split('/');
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  try {
    // Khusus halaman bukan /admin/* atau /login
    if (splitPath[1] !== 'admin' && pathName !== '/login')
      return NextResponse.next();

    // Jika tidak ada token dan refresh token
    if (!token && !refreshToken)
      return splitPath[1] === 'admin'
        ? NextResponse.redirect(`${origin}/login`)
        : NextResponse.next();

    if (refreshToken && !token) {
      if (!process.env.PRIVATE_KEY) throw new Error('Public key not found');

      const privateKey = await jose.importPKCS8(
        process.env.PRIVATE_KEY,
        'RS256',
      );

      const token = await new jose.SignJWT({ isLoggedIn: true })
        .setIssuedAt()
        .setProtectedHeader({ alg: 'RS256' })
        .sign(privateKey);

      console.log(token);

      return NextResponse.redirect(`${origin}${pathName}/`).cookie(
        'token',
        token,
        {
          httpOnly: true,
          sameSite: 'lax',
          expires: moment().add(5, 'minutes').toDate(),
        },
      );
    }

    if (!process.env.PUBLIC_KEY) throw new Error('Public key not found');
    const publicKey = await jose.importSPKI(process.env.PUBLIC_KEY, 'RS256');
    await jose.jwtVerify(token, publicKey);

    return splitPath[1] === 'admin'
      ? NextResponse.next()
      : NextResponse.redirect(`${origin}/admin/projects`);
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
