import { NextRequest, NextResponse } from "next/server";

/**
 * Defends against drive-by CSRF: without this, any website open in another
 * tab could POST straight to these routes — browsers don't block "simple"
 * cross-origin requests (e.g. `Content-Type: text/plain`), and both routes
 * parse the body as JSON via `req.json()` regardless of the declared
 * Content-Type. `/api/execute` in particular compiles and *runs* the
 * submitted code, so an unauthenticated cross-origin POST there is a full
 * remote-code-execution vector, not just a nuisance.
 *
 * The `Origin` header is set by the browser and cannot be overridden by
 * page JavaScript, so comparing it to the request's own `Host` is a
 * reliable same-origin check. A request with no `Origin` header at all
 * (e.g. `curl` during local development) is allowed through — this check
 * targets browser-borne CSRF, not direct network access, which is instead
 * addressed by binding the dev server to 127.0.0.1 (see package.json).
 */
export function rejectCrossOrigin(req: NextRequest): NextResponse | null {
  const origin = req.headers.get("origin");
  if (!origin) return null;

  const host = req.headers.get("host");
  try {
    if (new URL(origin).host === host) return null;
  } catch {
    // Malformed Origin header — fall through and reject.
  }

  return NextResponse.json({ error: "Cross-origin requests are not allowed." }, { status: 403 });
}
