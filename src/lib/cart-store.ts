import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  subtitle: string;
  price: number;
  color: string;
  colorHex: string;
  size?: string;
  qty: number;
  model: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: Omit<CartItem, "id" | "qty"> & { qty?: number }) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
      add: (item) => {
        const id = `${item.productId}-${item.color}-${item.size ?? ""}`;
        const existing = get().items.find((i) => i.id === id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, qty: i.qty + (item.qty ?? 1) } : i,
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...get().items, { ...item, id, qty: item.qty ?? 1 }],
            isOpen: true,
          });
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      setQty: (id, qty) =>
        set({
          items:
            qty <= 0
              ? get().items.filter((i) => i.id !== id)
              : get().items.map((i) => (i.id === id ? { ...i, qty } : i)),
        }),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: "luxeria-cart" },
  ),
);

export const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
