import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const accept = request.headers.get("accept") ?? "";

  if (accept.includes("text/html")) {
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|audio|backgrounds|houses|file\\.svg|globe\\.svg|window\\.svg|og\\.png|favicon\\.svg|favicon\\.ico|apple-touch-icon\\.png).*)",
  ],
};
