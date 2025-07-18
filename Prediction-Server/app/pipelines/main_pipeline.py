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
    return label, conf
