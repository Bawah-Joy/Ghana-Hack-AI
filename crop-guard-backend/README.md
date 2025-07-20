# Crop Disease Detection API Server

This project provides a **FastAPI** server that hosts and runs multiple deep learning models for crop disease detection. It allows you to send images of crop leaves via HTTP requests and receive predictions indicating disease type and confidence.

The server currently supports the following models:

- `xception_maize` – Maize disease detection via an Xception-based model
- `xception_cassava` – Cassava disease detection via an Xception-based model
- `xception_cashew` – Cashew disease detection via an Xception-based model
- `xception_tomato` – Tomato disease detection via an Xception-based model

> Note: Models are loaded on-demand and cached in memory to minimize latency while keeping RAM usage manageable.

---

## 🚀 Features

- **On-demand model loading**: Loads each model only when first requested.
- **Unified image pipeline**: Shared preprocessing and inference logic across all Xception-based models.
- **FastAPI + Uvicorn**: High-performance async server with built-in interactive docs (`/docs`).
- **CORS enabled**: Accepts requests from any origin (customize as needed).

---

## 📋 Requirements

- Python 3.10+
- Virtual environment (recommended)
- Packages listed in `requirements.txt`:

  - `fastapi`, `uvicorn`, `pillow`, `numpy`, `python-multipart`, `tensorflow` (or `tensorflow-cpu`)

---

## ⚙️ Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Bawah-Joy/Ghana-Hack-AI.git
   cd Ghana-Hack-AI/Prediction-Server
   ```

2. **Create a virtual environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate    # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Ensure models are placed in `model/` folder**:

   ```text
   model/
   ├─ xception_maize.keras
   ├─ xception_cassava.keras
   ├─ xception_cashew.keras
   └─ xception_tomato.keras
   ```

---

## Model Downloads

To use the prediction server, you must download the pre-trained models and place them in the appropriate directory (`models/` by default). You can download them from the following links:

- **Cassava Model**: [Download](https://drive.google.com/file/d/11mvp4TuIQ5NATksrRki-z2gWjJyU-j85/view?usp=sharing)
- **Maize Model**: [Download](https://drive.google.com/file/d/1TLtyN5uzFUwMVL6TjTN3ejKZtZBXi2hw/view?usp=sharing)
- **Tomato Model**: [Download](https://drive.google.com/file/d/1A9a-t3kspjdxqmqz11OoK62D9JPortw3/view?usp=sharing)
- **Cashew Model**: [Download](https://drive.google.com/file/d/1lxlHR6lWyOJJwZb9cE6JST8yEd8VtcZK/view?usp=sharing)

**After downloading:**

1.  Create a folder named `models` in the project root if it doesn’t already exist.
2.  Place the `.pkl` model files inside that `models/` folder.
3.  The server will automatically load the relevant model based on the selected crop during prediction.

---

## 🚀 Running Locally

1. **Start the server**:

   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Access interactive docs**:
   Open your browser at:
   `http://localhost:8000/docs`

3. **Test the `/predict` endpoint**:

   - Select `POST /predict`
   - Fill in **Model Name** (e.g. `xception_maize`)
   - (Optional) **Text** field can be left blank
   - Upload an image file
   - Click **Execute**

   Example `curl`:

   ```bash
   curl -X POST http://localhost:8000/predict \
     -F "model_name=xception_maize" \
     -F "file=@path/to/leaf.jpg"
   ```

   **Response**:

   ```json
   {
     "model": "xception_maize",
     "label": "leaf beetle",
     "confidence": 0.87
   }
   ```

---

## ☁️ Deployment on Render

1. **Ensure `render.yml`** is in the project root.
2. **Push** your branch to GitHub.
3. On Render dashboard, **create a new Web Service** pointing to this repo + branch.
4. Render will install dependencies (`pip install -r requirements.txt`) and start using:

   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

Your live URL’s `/docs` endpoint will work the same way for testing.

---

## 🗂️ Project Structure

```
Prediction-Server/
├─ app/
│  ├─ api/predict.py       # FastAPI routes
│  ├─ core/model.py        # Model manager & loader
│  ├─ pipelines/main_pipeline.py # Unified image preprocessing & inference
│  ├─ schemas/predict.py   # Pydantic request/response models
│  └─ main.py              # FastAPI app init + CORS
├─ model/                  # Place .keras model files here
├─ requirements.txt       # Python dependencies
├─ render.yml             # Render deployment config
└─ README.md              # This file
```
