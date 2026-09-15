import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CART_KEY, readStorage, writeStorage } from "../utils/storage";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

function cartStorageKey(userId) {
  return `${CART_KEY}.${userId || "guest"}`;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const storageKey = cartStorageKey(user?.id);
  const [items, setItems] = useState(() => {
    const stored = readStorage(storageKey, []);
    return Array.isArray(stored) ? stored : [];
  });

  useEffect(() => {
    const stored = readStorage(storageKey, []);
    setItems(Array.isArray(stored) ? stored : []);
  }, [storageKey]);

  const addItem = useCallback(
    (product, quantity = 1) => {
      const qty = Math.max(1, Number(quantity) || 1);
      const available = Number(product.quantity) || 0;
      setItems((current) => {
        const next = [...current];
        const productId = Number(product.id);
        const index = next.findIndex((item) => Number(item.productId) === productId);
        if (index >= 0) {
          const proposed = next[index].quantity + qty;
          next[index] = {
            ...next[index],
            productId,
            quantity: available > 0 ? Math.min(available, proposed) : proposed,
            name: product.name,
            sku: product.sku,
            price: Number(product.price),
            stock: available,
          };
        } else {
          next.push({
            productId,
            name: product.name,
            sku: product.sku,
            price: Number(product.price),
            quantity: available > 0 ? Math.min(qty, available) : qty,
            stock: available,
          });
        }
        writeStorage(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const updateQuantity = useCallback(
    (productId, quantity) => {
      const qty = Number(quantity);
      const id = Number(productId);
      setItems((current) => {
        const next =
          !Number.isFinite(qty) || qty <= 0
            ? current.filter((item) => Number(item.productId) !== id)
            : current.map((item) => (Number(item.productId) === id ? { ...item, quantity: qty, productId: id } : item));
        writeStorage(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const removeItem = useCallback(
    (productId) => {
      setItems((current) => {
        const next = current.filter((item) => Number(item.productId) !== Number(productId));
        writeStorage(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const clear = useCallback(() => {
    writeStorage(storageKey, []);
    setItems([]);
  }, [storageKey]);

  const count = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  const value = useMemo(
    () => ({ items, addItem, updateQuantity, removeItem, clear, count, subtotal }),
    [items, addItem, updateQuantity, removeItem, clear, count, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
