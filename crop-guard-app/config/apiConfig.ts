// config/apiConfig.ts

/**
 * Base URLs
 *  - DEV : your ngrok or local dev server
 *  - PROD: your hosted backend
 */
const DEV_BASE_URL = "https://a1848b133bf0.ngrok-free.app";
const PROD_BASE_URL = "https://your-backend-url.onrender.com";

/** Pick the right base URL */
const BASE_URL = __DEV__ ? DEV_BASE_URL : PROD_BASE_URL;

/** API endpoints */
export const ENDPOINTS = {
  PREDICT: "/predict",
} as const;

/** Build a full URL for a given endpoint key */
export function getEndpointUrl(endpoint: keyof typeof ENDPOINTS): string {
  return `${BASE_URL}${ENDPOINTS[endpoint]}`;
}

/** Crop → model mapping */
export const CROP_TO_MODEL_MAP: Record<string, string> = {
  Maize: "xception_maize",
  Cassava: "xception_cassava",
  Cashew: "xception_cashew",
  Tomato: "xception_tomato",
};

/** Fallback model if none selected */
export const DEFAULT_MODEL = CROP_TO_MODEL_MAP["Maize"];
