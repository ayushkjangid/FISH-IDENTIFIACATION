from fastapi import FastAPI, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# ================================
# LOAD YOLO
# ================================
print("\n[1/2] Loading YOLO...")
yolo_model = YOLO("yolov8n-oiv7.pt")  # OpenImages V7 has 'Fish' class
FISH_CLASS_INDEX = 192 # Index for 'Fish' in OIV7


# ================================
# LOAD CNN MODEL
# ================================
print("\n[2/2] Loading CNN Model...")
species_model = tf.keras.models.load_model("fish_model_mobilenet.h5")


# ================================
# LOAD CLASS LABELS
# ================================
with open("class_labels.json", "r") as f:
    class_indices = json.load(f)

CLASS_NAMES = list(class_indices.keys())


# ================================
# PREPROCESS
# ================================
def preprocess_image(img_array):
    img = Image.fromarray(img_array).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0   # ✅ CORRECT
    return np.expand_dims(img_array, axis=0)


# ================================
# API
# ================================
@app.get("/")
def home():
    return {"message": "Fish Detection API Running 🚀"}


@app.post("/predict")
async def predict(file: bytes = File(...)):
    try:
        image = Image.open(io.BytesIO(file)).convert("RGB")
        image_np = np.array(image)

        # ================================
        # YOLO DETECTION
        # ================================
        results = yolo_model(image_np)
        boxes = results[0].boxes
        cropped = image_np
        best_conf = 0.0

        if boxes is not None:
            for box in boxes:
                cls_idx = int(box.cls[0])
                conf = float(box.conf[0])
                # Filter specifically for Fish (192) or common marine life like Shark (451), Ray (417), Goldfish (221)
                if cls_idx in [192, 451, 417, 221] and conf > best_conf:
                    best_conf = conf
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().astype(int)
                    # Add small padding to crop
                    h, w = image_np.shape[:2]
                    padding = 10
                    x1, y1 = max(0, x1-padding), max(0, y1-padding)
                    x2, y2 = min(w, x2+padding), min(h, y2+padding)
                    cropped = image_np[y1:y2, x1:x2]

        if best_conf == 0:
            print("⚠️ No fish detected by YOLO → using full image")

        # ================================
        # CNN PREDICTION
        # ================================
        processed = preprocess_image(cropped)

        preds = species_model.predict(processed)
        confidence = float(np.max(preds))
        class_idx = int(np.argmax(preds))
        label = CLASS_NAMES[class_idx]

        # ================================
        # FINAL DECISION
        # ================================
        # If YOLO found a fish but CNN is unsure, we still return the CNN guess but note the low confidence
        if best_conf == 0 and confidence < 0.3:
            return {
                "label": "Not a Fish",
                "verification": "Failed"
            }

        return {
            "label": label,
            "confidence": confidence,
            "verification": "Passed" if confidence > 0.4 else "Inconclusive",
            "yolo_detection": "Fish" if best_conf > 0 else "None"
        }

    except Exception as e:
        return {"error": str(e)}


# ================================
# RUN
# ================================
if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)