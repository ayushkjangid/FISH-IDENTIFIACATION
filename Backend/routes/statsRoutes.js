import express from 'express';
import Prediction from '../models/Prediction.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const totalPredictions = await Prediction.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalSpecies = 31; // Based on ML model classes

    res.json({
      totalPredictions,
      totalUsers,
      totalSpecies
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;