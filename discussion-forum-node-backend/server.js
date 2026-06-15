require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');
const commentRoutes = require('./routes/commentRoutes');
const activityRoutes = require('./routes/activityRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:8000', credentials: true }));
app.use(express.json());

connectDB();

app.use('/api/comments', commentRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/search', searchRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Node.js Backend is running' });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Node.js backend running on port ${PORT}`);
});
