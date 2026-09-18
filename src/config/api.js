// Falls back to the live backend so a normal build/deploy is unaffected;
// override locally via .env.local (VITE_API_URL=http://localhost:5000),
// which is gitignored and never gets committed/pushed.
export const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.theiscale.com'