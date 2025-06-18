import { auth } from "./server/auth";

const PUBLIC_ROUTES = ["/", "/login", "/signup","/hero.png"];

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const { pathname } = req.nextUrl;

  // Allow public routes without auth
  if (PUBLIC_ROUTES.includes(pathname)) {
    return;
  }

  if (!isAuthenticated) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)",]
};

