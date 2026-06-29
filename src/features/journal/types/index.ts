import { JournalEntry } from '../../../types';

export interface JournalFilter {
  mood: JournalEntry['mood'] | 'all';
  productivity: number | 'all';
}
