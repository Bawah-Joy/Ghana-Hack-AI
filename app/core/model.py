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

    label, conf = predictor(data, model, name)
    return {"model": name, "label": label, "confidence": conf}
