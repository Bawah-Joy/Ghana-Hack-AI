from tensorflow.keras.models import load_model as keras_load_model
from tensorflow.keras.applications.xception import preprocess_input
from PIL import Image
import numpy as np
from io import BytesIO
import os
from pathlib import Path

# Base directory: two levels up from this file
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Map model names to class labels
CLASS_NAMES = {
    "xception_maize": ['fall armyworm', 'grasshoper', 'healthy', 'leaf beetle', 'leaf blight', 'leaf spot', 'streak virus'],
    "xception_cassava": ["bacterial blight", "brown spot", "green mite", "healthy", "mosaic"],
    "xception_cashew": ["anthracnose", "gumosis", "healthy", "leaf miner", "red rust"],
    "xception_tomato": ["healthy", "leaf blight", "leaf curl", "septoria leaf spot", "verticulium wilt"]
}

DISEASE_DATA = {
  "xception_maize": {
    "fall armyworm": {
      "description": "A destructive caterpillar that feeds on maize leaves and cobs.",
      "symptoms": ["Holes in leaves", "Frass (insect poop) near whorls", "Stunted growth"],
      "treatment": "Apply pesticides such as Spinosad or Bacillus thuringiensis. Early detection helps.",
      "prevention": "Plant early, use pest-resistant varieties, rotate crops.",
      "message": "Your maize might be under attack by fall armyworms. It's best to spray a safe pesticide like Spinosad and monitor regularly. Early action saves your yield!"
    },
    "grasshoper": {
      "description": "Insects that chew on maize leaves, reducing photosynthesis.",
      "symptoms": ["Jagged leaf edges", "Visible insects on leaves"],
      "treatment": "Use neem-based sprays or mechanical control.",
      "prevention": "Encourage natural predators like birds; avoid overuse of fertilizers.",
      "message": "Looks like grasshoppers are chewing on your maize. Spray neem oil and try attracting birds to your farm—they’re great helpers!"
    },
    "healthy": {
      "description": "Your crop shows no signs of disease or pest infestation.",
      "symptoms": [],
      "treatment": "No treatment needed.",
      "prevention": "Keep monitoring and maintain good farming practices.",
      "message": "Great job! Your maize is looking healthy. Keep up the good work and keep checking regularly."
    },
    "leaf beetle": {
      "description": "Beetles that skeletonize maize leaves, reducing growth.",
      "symptoms": ["Holes and transparent patches on leaves"],
      "treatment": "Use insecticidal soap or approved beetle pesticides.",
      "prevention": "Practice crop rotation and destroy old crop debris.",
      "message": "Leaf beetles may be feeding on your maize. Spray with safe insecticides and clean up leftover plant waste after harvest."
    },
    "leaf blight": {
      "description": "Fungal disease that causes dead streaks on leaves.",
      "symptoms": ["Long, greyish lesions", "Yellowing and dying leaves"],
      "treatment": "Apply fungicides like Mancozeb. Ensure good air circulation.",
      "prevention": "Avoid overhead watering; plant in well-spaced rows.",
      "message": "Maize leaf blight detected. Spray fungicide and avoid wetting leaves during irrigation."
    },
    "leaf spot": {
      "description": "Spots caused by fungus or bacteria, reducing photosynthesis.",
      "symptoms": ["Brown or black spots with yellow halos"],
      "treatment": "Spray with copper-based fungicide.",
      "prevention": "Use disease-free seeds and rotate maize with legumes.",
      "message": "Spots on your maize leaves suggest leaf spot. A copper fungicide should do the trick. Rotate crops to prevent re-infection."
    },
    "streak virus": {
      "description": "A viral disease transmitted by leafhoppers.",
      "symptoms": ["Yellow streaks", "Stunted plants", "Chlorotic leaves"],
      "treatment": "No cure, but remove and burn infected plants.",
      "prevention": "Control leafhoppers; use virus-free seeds.",
      "message": "Your maize may have streak virus. Uproot and burn infected plants quickly, and spray to control leafhoppers."
    }
  },

  "xception_cassava": {
    "bacterial blight": {
      "description": "A bacterial infection causing leaf wilting and stem dieback.",
      "symptoms": ["Angular leaf spots", "Wilted leaves", "Stem rot"],
      "treatment": "No direct cure, but pruning infected areas helps.",
      "prevention": "Use disease-free cuttings; plant early.",
      "message": "Cassava bacterial blight found. Cut off infected stems and plant clean cuttings next time."
    },
    "brown spot": {
      "description": "Fungal disease causing brown lesions on leaves.",
      "symptoms": ["Brown dry patches", "Defoliation in severe cases"],
      "treatment": "Apply Mancozeb or other fungicides.",
      "prevention": "Avoid overhead watering and weed regularly.",
      "message": "Your cassava shows brown spot symptoms. Apply fungicide and keep the field well-weeded."
    },
    "green mite": {
      "description": "Microscopic pests that feed on cassava leaves.",
      "symptoms": ["Leaf curling", "Yellowing", "Stunted growth"],
      "treatment": "Use neem oil or biological controls like predatory mites.",
      "prevention": "Use tolerant varieties and natural predators.",
      "message": "Green mites might be on your cassava. Spray neem oil and look into mite-resistant varieties."
    },
    "healthy": {
      "description": "Your cassava is in excellent condition.",
      "symptoms": [],
      "treatment": "None required.",
      "prevention": "Keep monitoring and weed regularly.",
      "message": "Well done! Your cassava looks healthy. Just maintain regular care and check for early signs of trouble."
    },
    "mosaic": {
      "description": "A viral disease causing leaf distortion.",
      "symptoms": ["Mottled leaves", "Distorted growth"],
      "treatment": "Remove and destroy infected plants.",
      "prevention": "Use resistant varieties and clean planting materials.",
      "message": "Cassava mosaic virus detected. Uproot affected plants and use resistant varieties for next season."
    }
  },

  "xception_cashew": {
    "anthracnose": {
      "description": "Fungal disease that attacks young shoots and fruits.",
      "symptoms": ["Black lesions", "Fruit drop", "Leaf spots"],
      "treatment": "Use copper-based fungicides like Copper Oxychloride.",
      "prevention": "Prune to increase airflow and avoid overhead irrigation.",
      "message": "Your cashew trees may have anthracnose. Apply copper fungicide and prune crowded branches."
    },
    "gumosis": {
      "description": "A physiological disorder where gum oozes from the bark.",
      "symptoms": ["Gum exudation", "Cracked bark", "Yellowing leaves"],
      "treatment": "Apply Bordeaux paste to the wounds.",
      "prevention": "Avoid waterlogging and mechanical injuries.",
      "message": "Gumosis spotted. Apply Bordeaux paste and ensure the soil drains well."
    },
    "healthy": {
      "description": "No signs of disease or pest issues on your cashew.",
      "symptoms": [],
      "treatment": "None needed.",
      "prevention": "Maintain clean pruning and proper watering.",
      "message": "Your cashew looks healthy! Keep following good care practices and you'll be rewarded with a good harvest."
    },
    "leaf miner": {
      "description": "Insects that burrow inside cashew leaves.",
      "symptoms": ["Winding trails on leaves", "Leaf curling"],
      "treatment": "Spray with Imidacloprid or neem-based pesticide.",
      "prevention": "Remove affected leaves; plant resistant varieties.",
      "message": "Leaf miners are feeding inside your cashew leaves. Spray with neem oil and remove damaged leaves."
    },
    "red rust": {
      "description": "Algae-caused disease that forms reddish growth on leaves.",
      "symptoms": ["Reddish-orange spots", "Reduced vigor"],
      "treatment": "Spray copper fungicide or lime-sulfur solution.",
      "prevention": "Avoid overcrowding and increase air circulation.",
      "message": "Red rust detected on your cashew. Treat with copper fungicide and give your plants some breathing room."
    }
  },

  "xception_tomato": {
    "healthy": {
      "description": "Tomatoes are growing well without any visible issues.",
      "symptoms": [],
      "treatment": "None needed.",
      "prevention": "Maintain good practices like mulching and spacing.",
      "message": "Your tomatoes are doing great! Keep watering regularly and monitor for any signs of pests or disease."
    },
    "leaf blight": {
      "description": "Fungal disease causing rapid leaf death.",
      "symptoms": ["Brown lesions", "Leaf drop", "Stem cankers"],
      "treatment": "Apply chlorothalonil or copper-based fungicide.",
      "prevention": "Avoid overhead watering and plant spacing.",
      "message": "Leaf blight may be affecting your tomatoes. Spray fungicide and avoid splashing water on leaves."
    },
    "leaf curl": {
      "description": "Viral disease spread by whiteflies.",
      "symptoms": ["Upward curling leaves", "Stunted growth"],
      "treatment": "Remove infected plants and control whiteflies.",
      "prevention": "Use yellow sticky traps and virus-resistant varieties.",
      "message": "Tomato leaf curl detected. Remove infected plants and trap whiteflies with yellow sticky traps."
    },
    "septoria leaf spot": {
      "description": "Fungal disease causing circular spots on tomato leaves.",
      "symptoms": ["Small brown circular spots", "Yellowing lower leaves"],
      "treatment": "Use Mancozeb or chlorothalonil spray.",
      "prevention": "Avoid wetting leaves; improve air circulation.",
      "message": "Spots on tomato leaves? That’s septoria. Spray fungicide and ensure your plants aren’t too crowded."
    },
    "verticulium wilt": {
      "description": "Soil-borne fungus that blocks water flow in tomatoes.",
      "symptoms": ["Wilting leaves", "Yellowing", "Reduced fruit size"],
      "treatment": "Remove affected plants and solarize soil.",
      "prevention": "Rotate crops and avoid planting tomatoes in the same spot every year.",
      "message": "Tomato wilt detected. Uproot infected plants and rotate your crops next season."
    }
  }
}


# Base path to models
MODEL_DIR = BASE_DIR / 'model'

# Load the model from disk
def load_model(name):
    model_path = os.path.join(MODEL_DIR, f"{name}.keras")
    return keras_load_model(model_path)

# Unified prediction logic
def predict_image(file_bytes, model, model_name):
    img = Image.open(BytesIO(file_bytes)).convert("RGB")
    img = img.resize((299, 299))  # Xception size

    arr = np.array(img, dtype=np.float32)
    arr = preprocess_input(arr)
    arr = np.expand_dims(arr, axis=0)

    preds = model.predict(arr)
    idx = int(np.argmax(preds))
    label = CLASS_NAMES[model_name][idx]
    conf = float(np.max(preds))
    return label, conf, DISEASE_DATA[model_name][label]
