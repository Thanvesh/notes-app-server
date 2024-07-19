const Note = require('../models/note');

exports.createNote = async (req, res) => {
  try {
    const note = new Note({
      ...req.body,
      userId: req.user.id
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getNotes = async (req, res) => {
  try {
    const { search, archived, trashed, reminder, label } = req.query;

    // Determine filter conditions
    let filter = { userId: req.user.id };

    // Default to non-archived and non-trashed notes if no search is provided
    if (!search) {
      filter.archived = false;
      filter.trashed = false;
    }

    // Apply additional filters based on query parameters
    if (archived === 'true') filter.archived = true;
    if (trashed === 'true') filter.trashed = true;
    if (reminder === 'true') filter.reminder = { $ne: null };
    if (label) filter.tags = label;

    // Perform search if search query is provided
    let notes;
    notes = await Note.find(filter);

    // Retrieve the notes by their IDs and ensure they are unique
    const uniqueNoteIds = [...new Set(notes.map(note => note._id))];
    const uniqueNotes = await Note.find({ _id: { $in: uniqueNoteIds } });

    res.json(uniqueNotes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getNotesByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const notes = await Note.find({
      userId: req.user.id,
      trashed: false,
      tags: tag
    });
    res.json(notes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getArchivedNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, archived: true, trashed: false });
    res.json(notes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).send('Note not found.');

    Object.assign(note, req.body);
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).send('Server error');
  }
};


exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).send('Note not found.');

    // Move to trash and remove from archives and reminders
    note.trashed = true;
    note.archived = false;
    note.reminder = null;
    note.deletedAt = new Date();

    await note.save();
    res.send('Note moved to trash.');
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.permanentlyDeleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).send('Note not found.');

    await Note.findByIdAndDelete(req.params.id);
    res.send('Note permanently deleted.');
  } catch (err) {
    console.error('Error permanently deleting note:', err);
    res.status(500).send('Server error');
  }
};





exports.getTrashedNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id, trashed: true });
    res.json(notes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getReminders = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.id,
      reminder: { $ne: null },
      trashed: false
    });
    res.json(notes);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
