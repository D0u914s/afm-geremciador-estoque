
// This file is now just re-exporting from the refactored module
import { useProductSearch } from './ProductSearch';
import type { ProductEntry, ProductExit, ProductSearchResult } from './ProductSearch/types';

export type { ProductEntry, ProductExit, ProductSearchResult };
export { useProductSearch };
