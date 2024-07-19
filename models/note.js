const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  backgroundColor: { type: String, default: '#ffffff' },
  reminder: { type: Date, default: null },
  archived: { type: Boolean, default: false },
  trashed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Note', NoteSchema);
