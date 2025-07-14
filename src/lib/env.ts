
export const env = {
  CONVEX_URL: import.meta.env.VITE_CONVEX_URL,
  MAPBOX_TOKEN: import.meta.env.VITE_MAPBOX_TOKEN,
  ANALYTICS_KEY: import.meta.env.VITE_ANALYTICS_KEY,
  NODE_ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

// Validate required environment variables
export function validateEnv() {
  const required = ['VITE_CONVEX_URL'] as const;
  
  for (const key of required) {
    if (!import.meta.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
