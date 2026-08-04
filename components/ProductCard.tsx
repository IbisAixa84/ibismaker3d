"use client";

import Image from 'next/image';
import { formatTitle } from '@/utils/formatTitle';
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
    if (product.category === 'personalizados' || product.category === 'diseños-personalizados') {
      return <button className="btn-pedir" onClick={() => onOrder(product)}>Consultar Diseño Personalizado</button>;
    }

    if (product.variant === 'video') {
      return (
        <>
          <button className="btn-pedir" onClick={() => onOpenMedia(product)}>{product.ctaLabel || 'Ver Demostración'}</button>
          {product.price > 0 ? (
            <button className="btn-pedir" onClick={handleAddToCart} style={{ marginTop: 10 }}>Agregar al carrito</button>
          ) : (
            <button className="btn-pedir" onClick={() => onOrder(product)} style={{ marginTop: 10 }}>Consultar Precio</button>
          )}
        </>
      );
    }

    return product.price > 0 ? <button className="btn-pedir" onClick={handleAddToCart}>Agregar al carrito</button> : <button className="btn-pedir" onClick={() => onOrder(product)}>Consultar Precio</button>;
  };

  const cardClasses = ['card', compact ? 'card--compact' : '', `card--${layout}`, product.category === 'invitaciones-digitales' ? 'card--invitaciones' : ''].filter(Boolean).join(' ');

  return (
    <article className={cardClasses} ref={cardRef}>
      <div className="card-img-container" onClick={() => onOpenMedia(product)} style={{ cursor: 'pointer' }}>
        {isVideo ? (
          <video className="product-img" autoPlay muted loop playsInline preload="metadata" poster={product.posterImage || product.image}>
            <source src={product.videoSrc} type="video/mp4" />
          </video>
        ) : (
          <Image className="product-img" src={product.image} alt={product.imageAlt || product.title} width={400} height={220} />
        )}
        <div className="tech-blueprint" />
      </div>
      <div className="card-content">
        <div>
          <h3 className="card-title">{formatTitle(product.title)}</h3>
          <div className="important-detail">📌 <strong>Importante:</strong> {product.important}</div>
          {product.price > 0 ? (
            <div className="prices-box">
              <div className="price-row minorista">
                <span>Precio:</span>
                <span>${product.price.toLocaleString('es-AR')} c/u</span>
              </div>
            </div>
          ) : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {product.category === 'personalizados' || product.category === 'diseños-personalizados' ? (
            <div className="important-detail" style={{ marginBottom: 0 }}>
              📎 Podés enviarnos fotos, referencias, textos o archivos en formato JPG, PNG, PDF o AI para empezar. Si lo necesitás, también podemos ayudarte a armar el diseño desde cero y coordinarlo por WhatsApp.
            </div>
          ) : null}
          {product.colors.length > 0 ? (
            <div className="control-group">
              <label>Color de Filamento:</label>
              <select className="prod-color" defaultValue={product.colors[0]}>
                {product.colors.map((color) => <option key={color} value={color}>{color}</option>)}
              </select>
            </div>
          ) : null}
          {(product.category !== 'diseños-personalizados' && product.variant !== 'video') ? (
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
          <div style={{ marginTop: 0 }}>
            {actionButtons()}
          </div>
        </div>
      </div>
    </article>
  );
}
