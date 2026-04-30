import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';
import toast from 'react-hot-toast';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, qty = 1) => {
        const items = get().items;
        const existing = items.find(i => i.product._id === product._id);
        if (existing) {
          set({ items: items.map(i => i.product._id === product._id ? { ...i, qty: i.qty + qty } : i) });
        } else {
          set({ items: [...items, { product, qty }] });
        }
        toast.success(`${product.name.en} added to cart!`);
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.product._id !== productId) });
      },
      updateQty: (productId, qty) => {
        if (qty < 1) return;
        set({ items: get().items.map(i => i.product._id === productId ? { ...i, qty } : i) });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + (i.product.offerPrice * i.qty), 0),
    }),
    { name: 'vastu-cart' }
  )
);
