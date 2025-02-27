export type FilterValuesType = 'all' | 'active' | 'completed';

export type Todolist = {
  id: string;
  title: string;
  filter: FilterValuesType;
  // addedDate: string
  // order: number
};
