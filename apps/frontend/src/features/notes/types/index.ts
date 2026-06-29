import { Note } from '../../../types';

export interface NotesFilter {
  category: string;
  searchQuery: string;
  selectedTags: string[];
}
