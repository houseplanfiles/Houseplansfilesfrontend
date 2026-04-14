// Vercel Edge Middleware — Bot Detection for OG Image Previews
// ─────────────────────────────────────────────────────────────
// PROBLEM: React SPA (Vite) renders OG meta tags via JavaScript.
//   Social media bots (WhatsApp, Facebook, LinkedIn) DON'T run JS.
//   So copy-pasting https://houseplanfiles.com/product/:slug gives
//   a blank HTML page with no OG tags → no image preview.
//
// SOLUTION: This middleware runs at the Vercel Edge (before the
//   React app). If the visitor is a social media bot, we redirect
//   it to the backend /share route which returns pre-rendered HTML
//   with full OG meta tags. Real users pass through untouched.
// ─────────────────────────────────────────────────────────────

export const config = {
  matcher: ["/product/:path*", "/professional-plan/:path*", "/blog/:path*"],
};

const BOT_REGEX =
  /facebookexternalhit|facebookcatalog|twitterbot|linkedinbot|whatsapp|telegrambot|slackbot|discordbot|pinterestbot|googlebot|bingbot|applebot|crawl|spider|bot|preview|scrape/i;

const SHARE_BACKEND = "https://houseplansfiles-backend.vercel.app";

export default function middleware(request: Request): Response | undefined {
  const userAgent = request.headers.get("user-agent") ?? "";

  // Regular user — let them go to the React SPA normally
  if (!BOT_REGEX.test(userAgent)) {
    return undefined; // Vercel: undefined = pass through
  }

  const { pathname } = new URL(request.url);

  // /product/:slug  →  backend /share/product/:slug
  const product = pathname.match(/^\/product\/([^/]+)$/);
  if (product) {
    return Response.redirect(`${SHARE_BACKEND}/share/product/${product[1]}`, 301);
  }

  // /professional-plan/:slug  →  backend /share/professional-plan/:slug
  const pro = pathname.match(/^\/professional-plan\/([^/]+)$/);
  if (pro) {
    return Response.redirect(`${SHARE_BACKEND}/share/professional-plan/${pro[1]}`, 301);
  }

  // /blog/:slug  →  backend /share/blog/:slug
  const blog = pathname.match(/^\/blog\/([^/]+)$/);
  if (blog) {
    return Response.redirect(`${SHARE_BACKEND}/share/blog/${blog[1]}`, 301);
  }

  return undefined; // Fallback — pass through
}
