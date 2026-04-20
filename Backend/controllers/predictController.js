import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import Prediction from '../models/Prediction.js';
import FishDetail from '../models/FishDetail.js';

export async function runPrediction(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post('http://localhost:8000/predict', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Move file to permanent storage
    const uniqueFilename = `${Date.now()}-${req.file.originalname}`;
    const targetPath = `uploads/predictions/${uniqueFilename}`;
    fs.copyFileSync(req.file.path, targetPath);

    // Save prediction to DB
    const prediction = new Prediction({
      userId: req.user.id,
      filename: uniqueFilename,
      fileUrl: `http://localhost:5000/${targetPath}`, // Save full URL
      species: response.data.label || response.data.Predicted_Class,
      confidence: response.data.confidence || response.data["Confidence (%)"],
    });
    await prediction.save();

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    // Fetch Fish Details from the secondary DB
    let fishDetails = null;
    try {
      const predictedLabel = response.data.label || response.data.Predicted_Class;
      if (predictedLabel) {
        // Find matching document case-insensitively
        fishDetails = await FishDetail.findOne({ 
          model_label: new RegExp(`^${predictedLabel}$`, 'i') 
        });
        
        // If not found by model_label, try by name
        if (!fishDetails) {
          fishDetails = await FishDetail.findOne({ 
            name: new RegExp(`^${predictedLabel}$`, 'i') 
          });
        }
      }
    } catch (dbErr) {
      console.error('Error fetching fish details:', dbErr.message);
      // We don't fail the request if details fetch fails
    }

    return res.json({ 
      ...response.data, 
      _id: prediction._id,
      fishDetails: fishDetails 
    });
  } catch (err) {
    console.error('Prediction proxy error:', err.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); // cleanup on error
    res.status(500).json({ error: 'Failed to get prediction from ML service' });
  }
}

export async function getUserPredictions(req, res) {
  try {
    const predictions = await Prediction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    console.error('Error fetching predictions:', err);
    res.status(500).json({ error: 'Failed to fetch prediction history' });
  }
}
