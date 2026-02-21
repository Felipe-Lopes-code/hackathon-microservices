import { create } from 'zustand';

// Library Store - manages teacher's saved educational materials
export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (material, quantity = 1) => {
    const items = get().items;
    const existingItem = items.find((item) => item.productId === material.id);

    if (existingItem) {
      // Material already in library - skip duplicate
      return;
    }
    
    set({
      items: [
        ...items,
        {
          productId: material.id,   // backend field name
          name: material.name,
          price: material.price,
          quantity: 1,
        },
      ],
    });
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((item) => item.productId !== productId) });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getItemCount: () => {
    return get().items.length;
  },
}));
