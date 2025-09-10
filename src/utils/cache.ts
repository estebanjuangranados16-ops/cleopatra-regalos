import { setItemWithExpiry, getItemWithExpiry } from './performance';

const CACHE_KEYS = {
  PRODUCTS: 'cleopatra-products-cache',
  SEARCH_RESULTS: 'cleopatra-search-cache',
  USER_PREFERENCES: 'cleopatra-user-prefs'
};

const CACHE_DURATION = {
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  SEARCH: 2 * 60 * 1000,   // 2 minutes
  USER_PREFS: 24 * 60 * 60 * 1000 // 24 hours
};

export class CacheManager {
  static setProducts(products: any[]) {
    setItemWithExpiry(CACHE_KEYS.PRODUCTS, products, CACHE_DURATION.PRODUCTS);
  }

  static getProducts() {
    return getItemWithExpiry(CACHE_KEYS.PRODUCTS);
  }

  static setSearchResults(query: string, results: any[]) {
    const searchCache = getItemWithExpiry(CACHE_KEYS.SEARCH_RESULTS) || {};
    searchCache[query] = results;
    setItemWithExpiry(CACHE_KEYS.SEARCH_RESULTS, searchCache, CACHE_DURATION.SEARCH);
  }

  static getSearchResults(query: string) {
    const searchCache = getItemWithExpiry(CACHE_KEYS.SEARCH_RESULTS) || {};
    return searchCache[query] || null;
  }

  static setUserPreferences(prefs: any) {
    setItemWithExpiry(CACHE_KEYS.USER_PREFERENCES, prefs, CACHE_DURATION.USER_PREFS);
  }

  static getUserPreferences() {
    return getItemWithExpiry(CACHE_KEYS.USER_PREFERENCES);
  }

  static clearAll() {
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static clearExpired() {
    Object.values(CACHE_KEYS).forEach(key => {
      getItemWithExpiry(key); // This will remove expired items
    });
  }
}