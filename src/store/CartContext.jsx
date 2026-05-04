import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "infinity_quote_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) return removeItem(productId);
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totals = items.reduce(
    (acc, { product, qty }) => {
      const base = parseFloat(product.price || 0);
      const gstPct = parseFloat(product.gst_percent || 18);
      const gstAmt = (base * gstPct) / 100;
      acc.subtotal += base * qty;
      acc.gstTotal += gstAmt * qty;
      return acc;
    },
    { subtotal: 0, gstTotal: 0 }
  );
  totals.grandTotal = totals.subtotal + totals.gstTotal;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totals }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
