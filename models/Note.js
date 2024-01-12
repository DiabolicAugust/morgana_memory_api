import { Schema, model } from 'mongoose';

const Note = new Schema({
  text: { type: String, require: true },
  dateOfCreation: { type: String, default: Date.now() },
});

export default model('Note', Note);
