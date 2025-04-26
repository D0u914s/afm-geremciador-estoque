
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductEntry, ProductExit, SearchFilters } from './types';

export function useProductEntryExitSearch(filters: SearchFilters) {
  const { searchTerm, filterType, dateFilter, activeSection } = filters;

  const searchProducts = async (): Promise<(ProductEntry | ProductExit)[]> => {
    if (!searchTerm) return [];

    const targetTable = activeSection === 'entry' ? 'product_entries' : 'product_exits';
    
    try {
      let query = supabase.from(targetTable).select('*');
      
      // Apply filters based on search type
      if (filterType === 'partNumber') {
        query = query.ilike('part_number', `%${searchTerm}%`);
      } else if (filterType === 'invoiceNumber' && activeSection === 'entry') {
        query = query.ilike('nota_fiscal', `%${searchTerm}%`);
      } else if (filterType === 'supplier' && activeSection === 'entry') {
        query = query.ilike('supplier', `%${searchTerm}%`);
      }
  
      // Apply date filter if present
      if (dateFilter) {
        query = query.eq('date', dateFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error searching products:', error);
        return [];
      }
      
      return data as (ProductEntry | ProductExit)[];
    } catch (error) {
      console.error('Error in searchProducts:', error);
      return [];
    }
  };

  return useQuery({
    queryKey: ['productSearch', searchTerm, filterType, dateFilter, activeSection],
    queryFn: searchProducts,
    enabled: !!searchTerm
  });
}
