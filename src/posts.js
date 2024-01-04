const express = require('express');
const { connectToMongoDB, closeMongoDBConnection } = require('../db');

const router = express.Router();

// Route to find posts with 'category' field excluded
router.get('/find-exclude-category', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('posts');

    const posts = await collection.find({}, { projection: { category: 0 } }).toArray();

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    closeMongoDBConnection();
  }
});

module.exports = router;