"use client";

import Image from 'next/image';
import { useRef } from 'react';
import type { Product } from '@/data/products';

type Props = {
  product: Product;
  compact?: boolean;
  layout?: 'default' | 'featured' | 'wide';
  onOpenMedia: (product: Product) => void;
  onAddToCart: (product: Product, payload: { color: string; quantity: number; details: string }) => void;
  onOrder: (product: Product) => void;
};

export default function ProductCard({ product, compact = false, layout = 'default', onOpenMedia, onAddToCart, onOrder }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isVideo = product.variant === 'video';

  const handleAddToCart = () => {
    const root = cardRef.current;
    const color = (root?.querySelector('.prod-color') as HTMLSelectElement | null)?.value || product.colors[0] || 'Dorado';
    const quantity = Number((root?.querySelector('.prod-cant') as HTMLInputElement | null)?.value || 1);
    const details = (root?.querySelector('.prod-detalles') as HTMLInputElement | null)?.value || '';
    onAddToCart(product, { color, quantity, details });
  };

  const actionButtons = () => {
    if (product.category === 'personalizados') {
      return <button className="btn-pedir" onClick={() => onOrder(product)}>Consultar Diseño Personalizado</button>;
    }

    if (product.variant === 'video') {
      return (
        <>
          <button className="btn-pedir" onClick={() => onOpenMedia(product)}>{product.ctaLabel || 'Ver Demostración'}</button>
          <button className="btn-pedir" onClick={() => onOrder(product)} style={{ marginTop: 10 }}>Consultar Precio</button>
        </>
      );
    }

    if (product.priceMinorista > 0) {
      return <button className="btn-pedir" onClick={handleAddToCart}>Agregar al carrito</button>;
    }

    return <button className="btn-pedir" onClick={() => onOrder(product)}>Consultar Precio</button>;
  };

  return (
    <article className={`card ${compact ? 'card--compact' : ''} card--${layout}`} ref={cardRef}>
      <div className="card-img-container" onClick={() => onOpenMedia(product)} style={{ cursor: 'pointer' }}>
        {isVideo ? (
          <video className="product-img" autoPlay muted loop playsInline preload="metadata">
            <source src={product.videoSrc} type="video/mp4" />
          </video>
        ) : (
          <Image className="product-img" src={product.image} alt={product.imageAlt || product.title} width={400} height={220} />
        )}
        <div className="tech-blueprint" />
      </div>
      <div className="card-content">
        <div>
          <h3 className="card-title">{product.title}</h3>
          <div className="important-detail">📌 <strong>Importante:</strong> {product.important}</div>
          {product.priceMinorista > 0 ? (
            <div className="prices-box">
              <div className="price-row minorista">
                <span>Precio Minorista:</span>
                <span>${product.priceMinorista.toLocaleString('es-AR')} c/u</span>
              </div>
              {product.priceMayorista > 0 ? (
                <div className="price-row mayorista">
                  <span>Precio Mayorista (10+):</span>
                  <span>${product.priceMayorista.toLocaleString('es-AR')} c/u</span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div>
          {product.colors.length > 0 ? (
            <div className="control-group">
              <label>Color de Filamento:</label>
              <select className="prod-color" defaultValue={product.colors[0]}>
                {product.colors.map((color) => <option key={color} value={color}>{color}</option>)}
              </select>
            </div>
          ) : null}
          {product.priceMinorista > 0 ? (
            <>
              <div className="control-group">
                <label>Cantidad:</label>
                <input type="number" className="prod-cant" defaultValue={1} min={1} />
              </div>
              {product.detailsLabel ? (
                <div className="control-group">
                  <label>{product.detailsLabel}</label>
                  <input type="text" className="prod-detalles" placeholder={product.placeholder} />
                </div>
              ) : null}
            </>
          ) : null}
          {actionButtons()}
        </div>
      </div>
    </article>
  );
}
