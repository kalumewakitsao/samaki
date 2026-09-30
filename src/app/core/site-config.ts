/**
 * Deployment switches. Analytics stays off until a privacy-friendly provider
 * account exists; set provider to 'plausible' and the domain to turn it on.
 */
export const SITE_CONFIG = {
  analytics: {
    provider: 'none' as 'none' | 'plausible',
    domain: 'samakiexpress.co.ke',
    scriptUrl: 'https://plausible.io/js/script.tagged-events.js',
  },
};
