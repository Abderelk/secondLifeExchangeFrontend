export interface Theme {
  id: number;
  name: string;
  week: number;
  dateRange: string;
  description: string;
  icon: string;
  status: 'completed' | 'current' | 'upcoming';
}