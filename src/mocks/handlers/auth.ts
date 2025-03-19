import { http, HttpResponse, delay, type PathParams } from "msw";
import * as jose from 'jose';

const delayInRange = Math.floor(Math.random() * (800 - 300 + 1)) + 300;

const SECRET_KEY = new TextEncoder().encode("afakesecretforthismockingapi");
const TOKEN_EXPIRATION_THRESHOLD = Math.floor(Date.now() / 1000) + 3600; // in seconds = 1hr from now

let sessionToken: string | null = null;
export const validateSessionToken = (token: string) => {
  return token === sessionToken;
};

type loginRequestBodyType = {
  id: string;
  role: Role;
}

export const handlers = [
  http.post<PathParams, loginRequestBodyType>("/api/login", async ({ request }) => {
    await delay(delayInRange)

    // because this is a mock login process, I will not handle credential validation
    // this is only to generate jwt token for authorization

    const user = await request.json()

    sessionToken = await new jose.SignJWT({ id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(TOKEN_EXPIRATION_THRESHOLD)
      .sign(SECRET_KEY);

    return HttpResponse.json({
      sessionToken
    })
  }),
  http.post("/api/logout", async () => {
    await delay(delayInRange)

    sessionToken = null;

    return new HttpResponse();
  })
]
