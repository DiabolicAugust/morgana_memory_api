import { Strings } from "../data/strings.js";
import Note from "../models/Note.js";
import { errorHandlingService } from "../service/errorService.js";

class notesController {
  async createNote(req, res) {
    try {
      const { text, dateOfCreation } = req.body;
      const note = new Note({ text, dateOfCreation });
      await note.save();
      return res
        .status(200)
        .json({ message: Strings.requests.noteCreationSuccsessful, note });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }

  async getNotes(req, res) {
    try {
      const notes = await Note.find();
      return res
        .status(200)
        .json({ message: Strings.requests.allNotes, notes: notes });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }
}

export default new notesController();
