import Note from '../models/Note.js';

class notesController {
  async createNote(req, res) {
    try {
      const { text, dateOfCreation } = req.body;

      if (!text) {
        return res
          .status(400)
          .json({ message: 'Text was not added or is blank' });
      }
      const note = new Note({ text, dateOfCreation });
      await note.save();
      return res.json({ message: 'Note has been created!', note });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'Note creation failed' });
    }
  }

  async getNotes(req, res) {
    try {
      const notes = await Note.find();
      return res.json({ message: 'All notes', notes: notes });
    } catch (error) {}
  }
}

export default new notesController();
