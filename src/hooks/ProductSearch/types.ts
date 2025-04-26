
export type ProductEntry = {
  id: string;
  nota_fiscal: string;
  part_number: string;
  quantity: number;
  date: string;
  created_at: string;
  created_by: string;
  inspector: string;
  supplier: string;
};

export type ProductExit = {
  id: string;
  order_number?: string;
  part_number: string;
  quantity: number;
  date: string;
  created_at: string;
  created_by: string;
  reason: string;
  responsible: string;
};

export type ProductSearchResult = {
  id: string;
  part_number: string;
  stock: number;
  entries?: number;
  exits?: number;
};

export type SearchFilters = {
  searchTerm: string;
  filterType: string;
  dateFilter: string;
  activeSection: 'entry' | 'exit';
};
