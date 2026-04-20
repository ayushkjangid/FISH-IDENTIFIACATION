import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js'; // Corrected import
import { requireAdmin } from '../middleware/requireAdmin.js';
import User from '../models/User.js';
import Prediction from '../models/Prediction.js';

const router = express.Router();

// Get all users
router.get('/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Stats (Total Users, Total Predictions, Charts Data)
router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPredictions = await Prediction.countDocuments();

    // Aggregation: Users joining over time (last 6 months)
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 } // Last 30 days for smoother line chart
    ]);

    // Aggregation: Species distribution
    const speciesDistribution = await Prediction.aggregate([
      {
        $group: {
          _id: "$species",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 } // Top 5 species
    ]);

    res.json({
      totalUsers,
      totalPredictions,
      userGrowth,
      speciesDistribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a user
router.delete('/users/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    // Optionally delete their predictions too:
    // await Prediction.deleteMany({ userId: id }); 
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role (Promote/Demote)
router.put('/users/:id/role', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
