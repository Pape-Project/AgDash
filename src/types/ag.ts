// src/types/ag.ts

/**
 * Core data structure matching the USDA CSV columns
 */
export interface CountyData {
  stateName: string;
  countyName: string;
  year: number;
  farms: number | null;
  croplandAcres: number | null;
  harvestedCroplandAcres: number | null;
  irrigatedAcres: number | null;
  marketValueTotalDollars: number | null;
  cropsSalesDollars: number | null;
  livestockSalesDollars: number | null;
  govPaymentsDollars: number | null;
  applesAcres: number | null;
  wheatAcres: number | null;
  riceAcres: number | null;
  hazelnutsAcres: number | null;
  grassSeedBentgrassAcres: number | null;
  grassSeedBermudagrassAcres: number | null;
  grassSeedBluegrassAcres: number | null;
  grassSeedBromegrassAcres: number | null;
  grassSeedFescueAcres: number | null;
  grassSeedOrchardgrassAcres: number | null;
  grassSeedRyegrassAcres: number | null;
  grassSeedSudangrassAcres: number | null;
  grassSeedTimothyAcres: number | null;
  grassSeedWheatgrassAcres: number | null;
  cornAcres: number | null;
  cornSilageAcres: number | null;
  hayAcres: number | null;
  haylageAcres: number | null;
  beefCattleHead: number | null;
  dairyCattleHead: number | null;
  // Farm Size (for Small Tractor Potential)
  farms1to9Acres: number | null;
  farms10to49Acres: number | null;
  farms50to69Acres: number | null;
  farms70to99Acres: number | null;
  farms100to139Acres: number | null;
  farms140to179Acres: number | null;
  farms180to499Acres: number | null;
  farms500to999Acres: number | null;
  farms1000to1999Acres: number | null;
  farms2000PlusAcres: number | null;
}

/**
 * Enhanced county data with computed fields for visualization
 */
export interface EnhancedCountyData extends CountyData {
  id: string; // Unique identifier: "STATE-COUNTY"
  croplandPercentage: number | null; // croplandAcres / landInFarmsAcres * 100 (Note: landInFarmsAcres is removed from base, checking usage)
  irrigationPercentage: number | null; // irrigatedAcres / croplandAcres * 100
  grassSeedAcres: number | null; // Aggregated grass seed acres
}

/**
 * Filter options for county data
 */
export interface FilterOptions {
  states: string[];
  locations: string[];
  metricRanges: Record<string, [number | null, number | null]>;
  searchQuery?: string;
}

/**
 * Sort configuration
 */
export type SortField =
  | 'countyName'
  | 'farms'
  | 'croplandAcres'
  | 'irrigatedAcres'
  | 'harvestedCroplandAcres'
  | 'marketValueTotalDollars'
  | 'cropsSalesDollars'
  | 'livestockSalesDollars'
  | 'govPaymentsDollars'
  | 'applesAcres'
  | 'wheatAcres'
  | 'riceAcres'
  | 'hazelnutsAcres'
  | 'grassSeedAcres'
  | 'cornAcres'
  | 'cornSilageAcres'
  | 'hayAcres'
  | 'haylageAcres'
  | 'beefCattleHead'
  | 'dairyCattleHead'
  | 'farms1to9Acres'
  | 'farms10to49Acres'
  | 'farms50to69Acres'
  | 'farms70to99Acres'
  | 'farms100to139Acres'
  | 'farms140to179Acres'
  | 'farms180to499Acres'
  | 'farms500to999Acres'
  | 'farms1000to1999Acres'
  | 'farms2000PlusAcres';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

/**
 * Natural language query result
 */
export interface QueryResult {
  counties: EnhancedCountyData[];
  queryType: 'highest' | 'lowest' | 'compare' | 'filter' | 'unknown';
  field?: SortField;
}
