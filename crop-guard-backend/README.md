# Crop Disease Detection API Server

A **FastAPI** server hosting multiple Xception‑based deep learning models for detecting diseases in maize, cassava, cashew, and tomato leaves. Send images via HTTP and receive back the predicted disease, confidence score, and recommended treatment.

---

## 📋 Features

- **On‑demand model loading**: Each model is loaded the first time it’s requested and then cached.
- **Unified image pipeline**: Shared resizing, normalization, and inference logic.
- **Interactive docs**: Built‑in Swagger UI at `/docs`.
- **CORS enabled**: Accepts requests from any origin (customize as needed).

---

## 🚀 Quick Start

### 1. Clone & Prepare

```bash
git clone https://github.com/Bawah-Joy/Ghana-Hack-AI.git
cd Ghana-Hack-AI/crop-guard-backend
python -m venv venv
source venv/bin/activate    # macOS/Linux
venv\Scripts\activate       # Windows
pip install --upgrade pip
pip install -r requirements.txt
```

### 2. Download & Place Models

Create a `model/` directory in the project root and download the pre-trained `.keras` files (examples below) into it:

```
model/
├─ xception_maize.keras
├─ xception_cassava.keras
├─ xception_cashew.keras
└─ xception_tomato.keras
```

**Download links** (example Google Drive):

- [Maize Model](https://drive.google.com/file/d/1TLtyN5uzFUwMVL6TjTN3ejKZtZBXi2hw/view)
- [Cassava Model](https://drive.google.com/file/d/11mvp4TuIQ5NATksrRki-z2gWjJyU-j85/view)
- [Cashew Model](https://drive.google.com/file/d/1lxlHR6lWyOJJwZb9n6JST8yEd8VtcZK/view)
- [Tomato Model](https://drive.google.com/file/d/1A9a-t3kspjdxqmqz11OoK62D9JPortw3/view)

### 3. Run Locally

#### Start the API

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### (Optional) Ngrok Tunneling

```bash
ngrok http 8000
```

Copy the HTTPS URL (e.g. `https://abcd1234.ngrok.io`) and use it in your frontend or API clients.

---

## ⚙️ Configuration

- No secrets required by default.
- CORS is enabled for all origins in `app/main.py` via:

  ```python
  app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
  )
  ```

---

## 📐 API Reference

### Interactive Docs

Browse and test all endpoints at:

```
http://localhost:8000/docs
```

### `/predict`

- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Fields:**

  - `file` (binary image file, e.g. JPEG/PNG)
  - `model_name` (string; one of `xception_maize`, `xception_cassava`, `xception_cashew`, `xception_tomato`)

#### Example `curl`

```bash
curl -X POST "https://<YOUR_NGROK>.ngrok.io/predict" \
  -F "file=@/path/to/leaf.jpg;type=image/jpeg" \
  -F "model_name=xception_maize"
```

#### Sample Response

```json
{
  "label": "leaf blight",
  "confidence": 0.87,
  "details": {
    "description": "Fungal disease that causes dead streaks on leaves.",
    "symptoms": ["Long, greyish lesions", "Yellowing and dying leaves"],
    "treatment": "Apply fungicides like Mancozeb. Ensure good air circulation.",
    "prevention": "Avoid overhead watering; plant in well-spaced rows.",
    "message": "Maize leaf blight detected. Spray fungicide and avoid wetting leaves during irrigation."
  }
}
```

---

## 🔄 Model Loading & Inference Flow

_All contained in `app/api/predict.py`:_

1. **Load model on first request**

   ```python
   def load_model(name):
       path = MODEL_DIR / f"{name}.keras"
       return keras_load_model(path)
   ```

2. **Preprocess & predict**

   ```python
   def predict_image(file_bytes, model, model_name):
       img = Image.open(BytesIO(file_bytes)).convert("RGB")
       img = img.resize((299, 299))
       arr = preprocess_input(np.expand_dims(np.array(img), 0))
       preds = model.predict(arr)
       idx = int(np.argmax(preds))
       label = CLASS_NAMES[model_name][idx]
       conf = float(np.max(preds))
       return label, conf, DISEASE_DATA[model_name][label]
   ```

3. **Return JSON** with `label`, `confidence`, and rich `details`.

---

## ☁️ Deployment on Render

1. Ensure `render.yml` is present in the project root.
2. Push to GitHub and connect the repo in Render.
3. Render will:

   - Install dependencies: `pip install -r requirements.txt`
   - Launch the app using:

     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```

---

## 🗂️ Project Structure

```
crop-guard-backend/
├─ app/
│  ├─ api/
│  │  └─ predict.py         # Routes & inference logic
│  ├─ core/
│  │  └─ model.py           # Model manager & loader
│  ├─ pipelines/
│  │  └─ main_pipeline.py   # Shared preprocessing flow
│  ├─ schemas/
│  │  └─ predict.py         # Request/response Pydantic models
│  └─ main.py               # FastAPI app setup + CORS
├─ model/                   # Place downloaded .keras files here
├─ requirements.txt         # Python dependencies
├─ render.yml               # Render deployment config
└─ README.md                # This file
```

---
