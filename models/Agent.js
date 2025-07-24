const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true }); // ✅ נוספה התמיכה ב־createdAt/updatedAt

module.exports = mongoose.model('Agent', agentSchema);
