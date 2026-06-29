import { apiClient } from '../../../services/apiClient';
import { JournalInput } from '../validation/schema';
import { JournalEntry } from '../../../types';

export const journalApi = {
  fetchEntries: async (): Promise<JournalEntry[]> => {
    return apiClient.journal.getAll();
  },
  createEntry: async (data: JournalInput): Promise<JournalEntry> => {
    return apiClient.journal.create(data);
  }
};
