import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteItem {
  id: string;
  name: string;
  price: string | number;
  image: string;
  category: 'gifts' | 'tech';
  description: string;
}

interface FavoritesState {
  items: FavoriteItem[];
  addItem: (item: FavoriteItem) => void;
  removeItem: (id: string) => void;
  clearFavorites: () => void;
  isInFavorites: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const exists = items.find(i => i.id === item.id);
        if (!exists) {
          set({ items: [...items, item] });
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
      },
      
      clearFavorites: () => {
        set({ items: [] });
      },
      
      isInFavorites: (id) => {
        return get().items.some(item => item.id === id);
      }
    }),
    {
      name: 'cleopatra-favorites'
    }
  )
);