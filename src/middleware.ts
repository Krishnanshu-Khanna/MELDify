import { auth } from "./server/auth";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];

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
    "/((?!_next|favicon|.*\\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|txt)).*)",
  ],
};

