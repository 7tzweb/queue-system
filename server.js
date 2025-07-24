const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

// ✅ ייבוא הנתיבים
const agentRoutes = require('./routes/agentRoutes');
const queueRoutes = require('./routes/queueRoutes');

// ✅ שימוש בנתיבים
app.use('/agents', agentRoutes);
app.use('/queue', queueRoutes);

// ✅ חיבור למסד ושרת
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  // ✅ חיבור למסד ושרת
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
