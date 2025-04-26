
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductSearchResult } from './types';

export function useStockSearch(searchTerm: string) {
  const getStockByPartNumber = async (): Promise<ProductSearchResult> => {
    if (!searchTerm) return {} as ProductSearchResult;

    try {
      // Get entries for this part
      const { data: entriesData, error: entriesError } = await supabase
        .from('product_entries')
        .select('quantity')
        .ilike('part_number', `%${searchTerm}%`);
  
      if (entriesError) {
        console.error('Error getting entries:', entriesError);
        return {} as ProductSearchResult;
      }
  
      // Get exits for this part
      const { data: exitsData, error: exitsError } = await supabase
        .from('product_exits')
        .select('quantity')
        .ilike('part_number', `%${searchTerm}%`);
  
      if (exitsError) {
        console.error('Error getting exits:', exitsError);
        return {} as ProductSearchResult;
      }
  
      // Calculate stock
      const totalEntries = (entriesData || []).reduce((sum, entry) => {
        const quantity = typeof entry.quantity === 'string' 
          ? parseFloat(entry.quantity)
          : (entry.quantity || 0);
        return sum + quantity;
      }, 0);
      
      const totalExits = (exitsData || []).reduce((sum, exit) => {
        const quantity = typeof exit.quantity === 'string'
          ? parseFloat(exit.quantity)
          : (exit.quantity || 0);
        return sum + quantity;
      }, 0);
      
      const stock = totalEntries - totalExits;
  
      return {
        id: searchTerm,
        part_number: searchTerm,
        stock,
        entries: totalEntries,
        exits: totalExits
      };
    } catch (error) {
      console.error('Error in getStockByPartNumber:', error);
      return {} as ProductSearchResult;
    }
  };

  return useQuery({
    queryKey: ['stockData', searchTerm],
    queryFn: getStockByPartNumber,
    enabled: !!searchTerm
  });
}
