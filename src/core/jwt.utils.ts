export function decodeJwt<T = Record<string, unknown>>(
  token: string,
): T | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    //JWT uses base64url - replace chars and pad before decoding
    const base64 = payload.replaceAll(/-/g, '+').replaceAll(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );
    return JSON.parse(atob(padded)) as T;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt<{ exp?: number }>(token);
  if (!payload?.exp) return true; // treat missing exp as expired
  // `exp` is in seconds, Date.now() is in milliseconds
  return Date.now() >= payload.exp * 1000;
}
