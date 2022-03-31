import * as jose from 'jose';
export async function verifyJwt(token: string) {
  if (!process.env.PUBLIC_KEY) throw new Error('PUBLIC KEY NOT FOUND');
  const publicKey = await jose.importSPKI(process.env.PUBLIC_KEY, 'RS256');
  return await jose.jwtVerify(token, publicKey);
}

export async function signJwt() {
  if (!process.env.PRIVATE_KEY) throw new Error('PRIVATE KEY NOT FOUND');

  const privateKey = await jose.importPKCS8(process.env.PRIVATE_KEY, 'RS256');
  const token = await new jose.SignJWT({ isLoggedIn: true })
    .setIssuedAt()
    .setProtectedHeader({ alg: 'RS256' })
    .sign(privateKey);

  return token;
}
