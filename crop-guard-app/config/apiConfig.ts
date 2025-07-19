// config/apiConfig.ts

import { Platform } from "react-native";

export const API_CONFIG = {
  LOCALHOST: "http://localhost:8000",
  ANDROID_EMULATOR: "https://18d8602bf13a.ngrok-free.app",
  // ANDROID_EMULATOR: "http://10.0.2.2:8000",
  PRODUCTION: "https://your-backend-url.onrender.com",
  ENDPOINTS: {
    PREDICT: "/predict",
  },
};

// pick the right base URL
export function getApiUrl() {
  if (__DEV__) {
    return Platform.OS === "android"
      ? API_CONFIG.ANDROID_EMULATOR
      : API_CONFIG.LOCALHOST;
  }
  return API_CONFIG.PRODUCTION;
}

// full URL builder
export function getEndpointUrl(endpoint: keyof typeof API_CONFIG.ENDPOINTS) {
  return getApiUrl() + API_CONFIG.ENDPOINTS[endpoint];
}

// map crop type → model name
export const CROP_TO_MODEL_MAP: Record<string, string> = {
  Maize: "xception_maize",
  Cassava: "xception_cassava",
  Cashew: "xception_cashew",
  Tomato: "xception_tomato",
};
export const DEFAULT_MODEL = "xception_maize";
