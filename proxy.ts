import { NextRequest, NextResponse } from "next/server";

const RETIRED_AI_PAGE_PREFIXES = ["/ai/daily", "/ai/prompts"];

const DEVELOPMENT_ONLY_PAGES = new Set([
  "/ai/vision-test",
  "/api-statistics",
  "/child-temp",
  "/recommendation-test",
  "/shadcn-example",
]);

export function proxy(request: NextRequest) {
  if (RETIRED_AI_PAGE_PREFIXES.some((path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`))) {
    const notFound = request.nextUrl.clone();
    notFound.pathname = "/_not-found";
    return NextResponse.rewrite(notFound, { status: 404 });
  }

  if (
    process.env.NODE_ENV === "production" &&
    DEVELOPMENT_ONLY_PAGES.has(request.nextUrl.pathname)
  ) {
    const notFound = request.nextUrl.clone();
    notFound.pathname = "/_not-found";
    return NextResponse.rewrite(notFound, { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/ai/daily/:path*",
    "/ai/prompts/:path*",
    "/ai/vision-test",
    "/api-statistics",
    "/child-temp",
    "/recommendation-test",
    "/shadcn-example",
  ],
};
