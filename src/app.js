const express = require('express');
const { connectToMongoDB, closeMongoDBConnection } = require('./db');
const postsRouter = require('./routes/posts');

const app = express();
const port = 3000;

app.use(express.json());

// Use posts routes
app.use('/posts', postsRouter);

// Create a new blog document
app.post('/blogs', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('blogs');
    const result = await collection.insertOne(req.body);
    res.status(201).json({ message: 'Blog created', _id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    closeMongoDBConnection();
  }
});

// Get all blogs
app.get('/blogs', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection('blogs');
    const blogs = await collection.find({}).toArray();
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    closeMongoDBConnection();
  }
});

// Additional routes for updating and deleting...

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});