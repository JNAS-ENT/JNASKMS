import { Project, Task } from '../../../types';

export interface BoardColumn {
  id: Task['status'];
  title: string;
  color: string;
}
