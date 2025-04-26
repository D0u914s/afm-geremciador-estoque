
import { useSearchFilters } from './useSearchFilters';
import { useProductEntryExitSearch } from './useProductEntryExitSearch';
import { useStockSearch } from './useStockSearch';
import { ProductEntry, ProductExit, ProductSearchResult } from './types';

export type { ProductEntry, ProductExit, ProductSearchResult };

export function useProductSearch(
  initialSearchTerm: string = '',
  initialFilterType: string = 'partNumber',
  initialDateFilter: string = '',
  initialActiveSection: 'entry' | 'exit' | 'parts' = 'entry'
) {
  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    dateFilter,
    setDateFilter,
    activeSection,
    setActiveSection
  } = useSearchFilters(initialSearchTerm, initialFilterType, initialDateFilter, initialActiveSection);

  // Use our extracted hooks
  const { data: searchResults = [], isLoading, refetch: refetchSearch } = useProductEntryExitSearch({
    searchTerm,
    filterType,
    dateFilter,
    activeSection
  });

  const { data: stockData = {} as ProductSearchResult, isLoading: isLoadingStock, refetch: refetchStock } = useStockSearch(
    searchTerm
  );

  const refetch = () => {
    refetchSearch();
    refetchStock();
  };

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    dateFilter,
    setDateFilter,
    activeSection,
    setActiveSection,
    searchResults,
    isLoading,
    stockData,
    isLoadingStock,
    refetch
  };
}
