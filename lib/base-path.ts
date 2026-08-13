/**
 * Prefix for static assets under public/.
 *
 * Next rewrites URLs for next/image and next/link, but NOT raw attributes like
 * <video src>. On GitHub Pages the site is served from /poroweb, so those paths
 * need prefixing by hand or they 404.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${BASE_PATH}${path}`;
