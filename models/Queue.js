const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'done'],
      default: 'pending',
    },
    assignedAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Queue', queueSchema);
