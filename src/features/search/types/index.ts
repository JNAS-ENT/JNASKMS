export interface SearchResultItem {
  id: string;
  type: 'note' | 'paper' | 'youtube' | 'journal';
  title: string;
  snippet: string;
  categoryOrChannel: string;
  date: string;
}
