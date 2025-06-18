import { auth } from "./server/auth";

export default auth((req) => {
  const isAuthenticated = !!req.auth;

  // Allow access to "/" even if not authenticated
  if (req.nextUrl.pathname === "/") {
    return;
  }

  if (!isAuthenticated) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"], // applies to all routes except static assets
};
