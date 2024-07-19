const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createNote,
  getNotes,
  getNotesByTag,
  getArchivedNotes,
  updateNote,
  deleteNote,
  getTrashedNotes,
  getReminders,
  permanentlyDeleteNote
} = require('../controllers/note');

router.post('/', auth, createNote);
router.get('/', auth, getNotes);
router.get('/tag/:tag', auth, getNotesByTag);
router.get('/archived', auth, getArchivedNotes);
router.get('/trash', auth, getTrashedNotes);
router.get('/reminders', auth, getReminders);
router.put('/:id', auth, updateNote);
router.delete('/:id', auth, deleteNote);
router.delete('/:id/permanent', auth, permanentlyDeleteNote);

module.exports = router;
