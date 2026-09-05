import { NextRequest } from "next/server";

export class PayloadTooLargeError extends Error {}

/**
 * Reads and JSON-parses a request body while enforcing a hard byte cap,
 * independent of the (client-controlled, spoofable) `Content-Length` header —
 * confirmed by testing that Next.js Route Handlers otherwise accept an
 * arbitrarily large body (a 50MB payload was accepted with no built-in
 * limit). Reads the stream incrementally and aborts as soon as the cap is
 * exceeded, rather than buffering the whole oversized body first.
 */
export async function readJsonLimited(req: NextRequest, maxBytes: number): Promise<unknown> {
  const reader = req.body?.getReader();
  if (!reader) return req.json(); // no body stream (shouldn't happen for POST, but don't crash)

  let received = 0;
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      throw new PayloadTooLargeError(`Request body exceeds ${maxBytes} bytes`);
    }
    chunks.push(value);
  }

  const combined = Buffer.concat(chunks.map((c) => Buffer.from(c)));
  return JSON.parse(combined.toString("utf8"));
}
