import { NextRequest, NextResponse } from 'next/server';
import { signJwt, verifyJwt } from '@src/utils/jwt';
import dayjs from 'dayjs';

export default async function middleware(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const pathName = req.nextUrl.pathname;
  const splitPath = pathName.split('/');
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  try {
    // Khusus halaman bukan /admin/* atau /login
    if (
      (splitPath[1] !== 'admin' &&
        pathName !== '/login' &&
        splitPath[1] !== 'api') ||
      (splitPath[1] === 'api' && req.method === 'GET') ||
      (pathName === '/api/auth/login' && req.method === 'POST')
    )
      return NextResponse.next();

    // Jika tidak ada token dan refresh token
    if (!token && !refreshToken)
      switch (splitPath[1]) {
        case 'admin':
          return NextResponse.redirect(`${origin}/login`);
        case 'api':
          return new Response(
            JSON.stringify({
              errors: [
                {
                  title: 'token not found',
                  detail: 'token not found',
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
        default:
          return NextResponse.next();
      }

    if (refreshToken && !token) {
      const token = await signJwt();

      return NextResponse.next().cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        expires: dayjs().add(5, 'm').toDate(),
      });
    }

    await verifyJwt(token);

    return splitPath[1] === 'admin' || splitPath[1] === 'api'
      ? NextResponse.next()
      : NextResponse.redirect(`${origin}/admin`);
  } catch (err) {
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
