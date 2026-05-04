import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  (process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "missing-jwt-secret") as string
);

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/verify-otp",
  "/apply",
  "/credit-score",
  "/success",
  "/personal-loan",
  "/home-loan",
  "/business-loan",
  "/credit-card",
  "/emi-calculator",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/grievance",
  "/dsa/apply",
];

const PUBLIC_PREFIXES = [
  "/api/otp/",
  "/api/auth/",
  "/api/offers",
  "/api/credit-score",
  "/api/dsa/register",
  "/_next/",
  "/favicon.ico",
  "/public/",
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  for (const prefix of PUBLIC_PREFIXES) {
    if (pathname.startsWith(prefix)) return true;
  }
  return false;
}

async function verifyAndGetPayload(token: string): Promise<{ role: string; id: string } | null> {
  try {
    const result = await jwtVerify(token, JWT_SECRET);
    return { role: String(result.payload.role), id: String(result.payload.id) };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths through immediately
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Admin routes
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    const token = request.cookies.get("admin-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const payload = await verifyAndGetPayload(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const response = NextResponse.next();
    response.headers.set("X-Staff-Id", payload.id);
    return response;
  }

  // DSA routes
  if (pathname.startsWith("/dsa")) {
    if (pathname === "/dsa/login") return NextResponse.next();

    const token = request.cookies.get("dsa-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/dsa/login", request.url));
    }
    const payload = await verifyAndGetPayload(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/dsa/login", request.url));
    }
    if (payload.role !== "dsa") {
      return NextResponse.redirect(new URL("/dsa/login", request.url));
    }

    const response = NextResponse.next();
    response.headers.set("X-Dsa-Id", payload.id);
    return response;
  }

  // Dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("user-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const payload = await verifyAndGetPayload(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const response = NextResponse.next();
    response.headers.set("X-User-Id", payload.id);
    return response;
  }

  // API admin routes
  if (pathname.startsWith("/api/admin")) {
    const token =
      request.cookies.get("admin-token")?.value ??
      request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await verifyAndGetPayload(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const response = NextResponse.next();
    response.headers.set("X-Staff-Id", payload.id);
    return response;
  }

  // API DSA routes — verify dsa-token cookie and inject X-Dsa-Id
  if (pathname.startsWith("/api/dsa")) {
    const token = request.cookies.get("dsa-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await verifyAndGetPayload(token);
    if (!payload || payload.role !== "dsa") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const response = NextResponse.next();
    response.headers.set("X-Dsa-Id", payload.id);
    return response;
  }

  // API user routes (require auth)
  if (pathname.startsWith("/api/user") || pathname === "/api/leads/mine") {
    const token =
      request.cookies.get("user-token")?.value ??
      request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await verifyAndGetPayload(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const response = NextResponse.next();
    response.headers.set("X-User-Id", payload.id);
    return response;
  }

  // Public routes — pass through
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dsa/:path*",
    "/dashboard/:path*",
    "/api/admin/:path*",
    "/api/dsa/:path*",
    "/api/user/:path*",
    "/api/leads/mine",
  ],
};