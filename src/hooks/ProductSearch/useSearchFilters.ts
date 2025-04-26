
import { useState } from 'react';
import { SearchFilters } from './types';

export function useSearchFilters(
  initialSearchTerm: string = '',
  initialFilterType: string = 'partNumber',
  initialDateFilter: string = '',
  initialActiveSection: 'entry' | 'exit' | 'parts' = 'entry'
): SearchFilters & {
  setSearchTerm: (term: string) => void;
  setFilterType: (type: string) => void;
  setDateFilter: (date: string) => void;
  setActiveSection: (section: 'entry' | 'exit' | 'parts') => void;
} {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filterType, setFilterType] = useState(initialFilterType);
  const [dateFilter, setDateFilter] = useState(initialDateFilter);
  const [activeSection, setActiveSection] = useState<'entry' | 'exit' | 'parts'>(initialActiveSection);

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    dateFilter,
    setDateFilter,
    activeSection,
    setActiveSection
  };
}
