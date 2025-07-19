// config/apiConfig.ts

// API Configuration
export const API_CONFIG = {
  // Development URLs
  LOCALHOST: 'http://localhost:8000',
  ANDROID_EMULATOR: 'http://10.0.2.2:8000',
  IOS_SIMULATOR: 'http://localhost:8000',
  
  // Production URL (replace with your deployed backend URL)
  PRODUCTION: 'https://your-backend-url.render.com',
  
  // Current environment - change this based on your development setup
  BASE_URL: __DEV__ ? 'http://localhost:8000' : 'https://your-backend-url.render.com',
  
  // API Endpoints
  ENDPOINTS: {
    PREDICT: '/predict',
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
};

// Map crop types to backend model names
export const CROP_TO_MODEL_MAP: { [key: string]: string } = {
  'Maize': 'xception_maize',
  'Cassava': 'xception_cassava',
  'Cashew': 'xception_cashew',
  'Tomato': 'xception_tomato',
  // Add more crops as your backend supports them
};

// Disease-specific treatment recommendations
export const DISEASE_RECOMMENDATIONS: { [key: string]: string[] } = {
  // Maize diseases
  'leaf beetle': [
    'Apply neem-based insecticide during early morning or evening hours',
    'Install yellow sticky traps to monitor and control beetle populations',
    'Practice crop rotation to disrupt the beetle lifecycle',
    'Remove and destroy heavily infested plant debris immediately',
    'Consider introducing beneficial insects like parasitic wasps',
    'Maintain field hygiene by removing weeds that harbor pests'
  ],
  
  'leaf spot': [
    'Improve air circulation by proper plant spacing',
    'Apply copper-based fungicide as a preventive measure',
    'Remove and destroy infected leaves immediately upon detection',
    'Avoid overhead irrigation to minimize leaf wetness duration',
    'Use certified disease-resistant seed varieties when available',
    'Apply balanced fertilizer to strengthen plant immunity'
  ],
  
  'streak virus': [
    'Remove and destroy infected plants immediately to prevent spread',
    'Control aphid vectors using appropriate insecticides',
    'Use reflective silver mulch to deter aphid landing',
    'Plant certified virus-free seeds or resistant varieties',
    'Maintain proper plant spacing for good air circulation',
    'Monitor field borders where aphids typically enter first'
  ],
  
  'blight': [
    'Apply preventive fungicide spray before symptom appearance',
    'Ensure adequate drainage to prevent waterlogging',
    'Space plants properly to improve air circulation',
    'Remove lower leaves that touch the soil',
    'Use certified disease-free seeds',
    'Rotate with non-host crops for 2-3 seasons'
  ],
  
  // Cassava diseases
  'cassava mosaic disease': [
    'Use certified virus-free planting materials',
    'Control whitefly vectors with appropriate insecticides',
    'Remove and destroy infected plants immediately',
    'Plant resistant cassava varieties where available',
    'Maintain field hygiene by removing plant debris',
    'Space plants adequately for better monitoring'
  ],
  
  'bacterial blight': [
    'Use certified disease-free planting materials',
    'Apply copper-based bactericide during early infection stages',
    'Improve field drainage to reduce humidity',
    'Remove and burn infected plant parts',
    'Practice crop rotation with non-host plants',
    'Avoid working in fields when plants are wet'
  ],
  
  // Tomato diseases
  'early blight': [
    'Apply preventive fungicide before symptoms appear',
    'Remove lower leaves that touch the soil',
    'Provide adequate plant support and spacing',
    'Water at soil level to keep foliage dry',
    'Remove and destroy infected plant debris',
    'Apply balanced fertilizer to maintain plant vigor'
  ],
  
  'late blight': [
    'Apply preventive fungicide sprays regularly',
    'Ensure excellent air circulation around plants',
    'Avoid overhead watering, especially in the evening',
    'Remove infected plants immediately',
    'Use certified disease-free seeds or seedlings',
    'Monitor weather conditions and spray before humid periods'
  ],
  
  // Cashew diseases
  'anthracnose': [
    'Apply preventive copper-based fungicide sprays',
    'Prune trees to improve air circulation',
    'Remove and destroy fallen infected fruits and leaves',
    'Time fungicide applications with flowering period',
    'Maintain proper orchard sanitation',
    'Ensure adequate tree spacing during establishment'
  ],
  
  // Healthy plants
  'healthy plant': [
    'Continue your current excellent care practices',
    'Monitor plants regularly for early detection of problems',
    'Maintain consistent watering schedule appropriate for the crop',
    'Apply balanced fertilizer according to soil test recommendations',
    'Keep the growing area clean and free from weeds',
    'Inspect plants weekly for any signs of stress or disease'
  ],
  
  'healthy': [
    'Maintain current care routine as plants are thriving',
    'Continue regular monitoring for any changes',
    'Follow recommended fertilization schedule',
    'Ensure proper irrigation management',
    'Practice preventive pest and disease management',
    'Keep accurate records of your successful practices'
  ],
  
  // Default fallback recommendations
  'unknown': [
    'Consult with your local agricultural extension officer',
    'Take additional photos showing different parts of the plant',
    'Consider getting a second opinion from an agricultural expert',
    'Monitor the plant closely for any changes in symptoms',
    'Document the progression with photos and notes',
    'Check soil conditions and environmental factors'
  ]
};

// Function to get recommendations for a given diagnosis
export const getRecommendations = (diagnosis: string): string[] => {
  const lowerDiagnosis = diagnosis.toLowerCase().trim();
  
  // Try exact match first
  if (DISEASE_RECOMMENDATIONS[lowerDiagnosis]) {
    return DISEASE_RECOMMENDATIONS[lowerDiagnosis];
  }
  
  // Try partial matches
  for (const key in DISEASE_RECOMMENDATIONS) {
    if (lowerDiagnosis.includes(key) || key.includes(lowerDiagnosis)) {
      return DISEASE_RECOMMENDATIONS[key];
    }
  }
  
  // Return default recommendations if no match found
  return DISEASE_RECOMMENDATIONS['unknown'];
};

// Network configuration helper
export const getApiUrl = (): string => {
  // For development, you might want to detect the platform
  // and return appropriate localhost URL
  if (__DEV__) {
    // You can implement platform detection here if needed
    return API_CONFIG.LOCALHOST;
  }
  
  return API_CONFIG.PRODUCTION;
};

// Helper function to create the full API endpoint URL
export const getEndpointUrl = (endpoint: keyof typeof API_CONFIG.ENDPOINTS): string => {
  return `${getApiUrl()}${API_CONFIG.ENDPOINTS[endpoint]}`;
};