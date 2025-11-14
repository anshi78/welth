import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define the routes that are protected
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// This is the main middleware function
export default clerkMiddleware((auth, req) => {
  // If the route is a protected route, protect it
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

// This config specifies which routes the middleware runs on
export const config = {

  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};