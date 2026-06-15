const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  action: { type: String, required: true, enum: ['UPVOTED_POST', 'COMMENTED', 'CREATED_POST', 'VIEWED_POST', 'DELETED_POST', 'UPDATED_POST'] },
  target_type: { type: String, required: true, enum: ['post', 'comment'] },
  target_id: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
