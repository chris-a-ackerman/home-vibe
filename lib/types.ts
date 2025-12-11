export interface SavedCriteria {
  id: string;
  name: string;
  criteria: Record<string, string>;
  user_id?: string;
  created_at: string;
  updated_at?: string;
  addresses_evaluated?: number;
}
