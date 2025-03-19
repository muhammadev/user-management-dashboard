export function isTokenExpired(tokenExpirationTime: number) {
  const now = Math.floor(Date.now() / 1000);

  return now > tokenExpirationTime;
}
