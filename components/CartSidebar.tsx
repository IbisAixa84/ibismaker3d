"use client";

import { useMemo } from 'react';
import { formatTitle } from '@/utils/formatTitle';
import type { Product } from '@/data/products';

type Props = {
  items: Array<{ product: Product; quantity: number; color: string; details: string }>;
  onRemove: (identifier: string) => void;
};

export default function CartSidebar({ items, onRemove }: Props) {
  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);

  if (items.length === 0) return null;

  return (
    <aside className="cart-sidebar" style={{ position: 'fixed', right: 20, top: 90, zIndex: 2000, width: 280, background: '#100e21', border: '1px solid rgba(0,240,255,.2)', borderRadius: 16, padding: 16, boxShadow: '0 10px 25px rgba(0,0,0,.25)' }}>
      <h3 style={{ marginBottom: 12, color: '#00f0ff' }}>🛒 Pedido</h3>
      {items.map((item) => (
        <div key={item.product.identifier} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{formatTitle(item.product.title)}</strong>
            <button onClick={() => onRemove(item.product.identifier)} style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ fontSize: '.85rem', color: '#a6b4c9' }}>
            {item.quantity} unidad/es · {item.color}
          </div>
          {item.details ? <div style={{ fontSize: '.8rem', color: '#8d9bb0' }}>{item.details}</div> : null}
        </div>
      ))}
      <div style={{ marginTop: 8, fontWeight: 700 }}>Cantidad total: {totalItems}</div>
      <div style={{ marginTop: 8, fontWeight: 700 }}>Total estimado: ${totalPrice.toLocaleString('es-AR')}</div>
    </aside>
  );
}
