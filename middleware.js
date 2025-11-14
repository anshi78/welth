import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define the routes that are protected
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

export default clerkMiddleware();

// This config specifies which routes the middleware runs on
export const config = {

  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};