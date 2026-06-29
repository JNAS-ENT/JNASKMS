import { apiClient } from '../../../services/apiClient';
import { NoteInput } from '../validation/schema';
import { Note } from '../../../types';

export const notesApi = {
  fetchNotes: async (): Promise<Note[]> => {
    return apiClient.notes.getAll();
  },
  createNote: async (data: NoteInput): Promise<Note> => {
    return apiClient.notes.create({
      ...data,
      tags: data.tags || []
    });
  },
  updateNote: async (id: string, data: Partial<NoteInput>): Promise<Note> => {
    return apiClient.notes.update(id, data);
  },
  deleteNote: async (id: string): Promise<boolean> => {
    return apiClient.notes.delete(id);
  }
};
