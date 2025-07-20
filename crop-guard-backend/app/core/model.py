import gc
# from app.pipelines.sentiment_pipeline import load_model as load_sentiment, predict_sentiment
from app.pipelines.main_pipeline import load_model as load_maize, predict_image

_cache = {}

async def predict(req, file):
    name = req.model_name
    # choose loader/predictor
    # if name == "sentiment":
        # loader, predictor, data = load_sentiment, predict_sentiment, req.text
    if name.startswith("xception_"):
        loader, predictor, data = load_maize, predict_image, await file.read()
    else:
        raise ValueError("Unknown model")

    # load-on-demand
    if name not in _cache:
        _cache[name] = loader(name)
    model = _cache[name]

    # label, conf, disease_data = "Disease", 0.564, {"leaf beetle": {
    #   "description": "Beetles that skeletonize maize leaves, reducing growth.",
    #   "symptoms": ["Holes and transparent patches on leaves"],
    #   "treatment": "Use insecticidal soap or approved beetle pesticides.",
    #   "prevention": "Practice crop rotation and destroy old crop debris.",
    #   "message": "Leaf beetles may be feeding on your maize. Spray with safe insecticides and clean up leftover plant waste after harvest."
    # }}
    label, conf, disease_data = predictor(data, model, name)
    return {"model": name, "label": label, "confidence": conf, "recommendation": disease_data}

