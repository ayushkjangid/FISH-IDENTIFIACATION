import io
import numpy as np
from PIL import Image
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_inference():
    print("Testing API with a random noise image...")
    # Create random noise image
    img = Image.fromarray(np.random.randint(0, 255, (300, 300, 3), dtype=np.uint8))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    image_bytes = buf.getvalue()

    try:
        response = client.post("/predict", files={"file": ("test.jpg", image_bytes, "image/jpeg")})
        print("Response:", response.json())
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_inference()
