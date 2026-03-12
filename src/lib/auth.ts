import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = "idip-dashboard-secret-key-change-this-in-env";

// Simple custom signed token logic to avoid 'jose' dependency
async function sign(payload: any, secret: string) {
  const encoder = new TextEncoder();
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const stringifiedPayload = btoa(JSON.stringify(payload));
  const data = encoder.encode(`${header}.${stringifiedPayload}`);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, data);
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  return `${header}.${stringifiedPayload}.${signatureBase64}`;
}

async function verify(token: string, secret: string) {
  const [header, payload, signature] = token.split(".");
  const encoder = new TextEncoder();
  const data = encoder.encode(`${header}.${payload}`);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  
  const sigBytes = new Uint8Array(
    atob(signature.replace(/-/g, "+").replace(/_/g, "/"))
      .split("")
      .map((c) => c.charCodeAt(0))
  );

  const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, data);
  if (!isValid) return null;
  return JSON.parse(atob(payload));
}

export async function encrypt(payload: any) {
  return await sign(payload, secretKey);
}

export async function decrypt(input: string): Promise<any> {
    try {
        return await verify(input, secretKey);
    } catch (e) {
        return null;
    }
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  if (!parsed) return;

  parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}

export async function hashPassword(password: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string) {
    const newHash = await hashPassword(password);
    return newHash === hash;
}
