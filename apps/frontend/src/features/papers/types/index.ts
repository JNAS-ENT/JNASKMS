import { ResearchPaper } from '../../../types';

export interface PapersFilter {
  search: string;
  status: ResearchPaper['status'] | 'all';
  tag: string;
}
