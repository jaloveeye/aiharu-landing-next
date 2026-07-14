import { NextRequest, NextResponse } from "next/server";

const DEVELOPMENT_ONLY_PAGES = new Set([
  "/ai/vision-test",
  "/api-statistics",
  "/child-temp",
  "/recommendation-test",
  "/shadcn-example",
]);

export function proxy(request: NextRequest) {
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
    "/ai/vision-test",
    "/api-statistics",
    "/child-temp",
    "/recommendation-test",
    "/shadcn-example",
  ],
};
