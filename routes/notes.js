const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All notes routes require authentication
router.use(authMiddleware);

// GET /api/notes — get all notes for the logged-in user
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId }).sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    console.error('Get notes error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/notes — create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      user: req.user.userId,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error('Create note error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join('. ') });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/notes/:id — get a single note
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid note ID' });
    }

    const note = await Note.findOne({ _id: req.params.id, user: req.user.userId });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (err) {
    console.error('Get note error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/notes/:id — update a note
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid note ID' });
    }

    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title: title.trim(), content: content.trim() },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (err) {
    console.error('Update note error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: messages.join('. ') });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/notes/:id — delete a note
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid note ID' });
    }

    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(200).json({ message: `Note "${note.title}" deleted successfully` });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
