import { Router } from 'express';
import notesController from './notesController.js';

const notesRouter = Router();

notesRouter.post('/createNote', notesController.createNote);
notesRouter.get('/getNotes', notesController.getNotes);

export default notesRouter;
