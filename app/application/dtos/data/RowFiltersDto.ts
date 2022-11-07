export interface RowFiltersDto {
  customRow: boolean;
  query: string | null;
  properties: {
    name?: string;
    value: string | null;
    condition?: string;
  }[];
  tags: string[];
}
