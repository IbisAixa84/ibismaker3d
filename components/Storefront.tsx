"use client";

import Image from 'next/image';
import { useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import MediaModal from '@/components/MediaModal';
import CartSidebar from '@/components/CartSidebar';
import { products, type Product } from '@/data/products';
import { formatTitle } from '@/utils/formatTitle';

const events = [
  { id: 'todos', label: 'Todos' },
  { id: 'baby', label: 'Baby Shower' },
  { id: 'nacimiento', label: 'Nacimiento' },
  { id: 'bautismo', label: 'Bautismo' },
  { id: 'primer', label: 'Primer Añito' },
  { id: 'comunion', label: 'Comunión' },
  { id: 'quince', label: 'Mis Quince' },
  { id: 'dieciocho', label: 'Mis 18 Años' },
  { id: 'graduacion', label: 'Graduación' },
  { id: 'casamiento', label: 'Casamiento' },
  { id: 'personalizados', label: 'Eventos Personalizados' },
  { id: 'invitaciones', label: 'Invitaciones' },
];

const promoProduct = products.find((product) => product.id === 'invitacion-interactiva-1') ?? null;

type CartItem = {
  product: Product;
  quantity: number;
  color: string;
  details: string;
};

function makeWhatsAppMessage(items: CartItem[], baseUrl = '') {
  const lines = ['¡Hola IbisMaker 3D! 👋 Quiero realizar el siguiente pedido:\n'];
  items.forEach((item, index) => {
    const imagePath = item.product.posterImage || item.product.image;
    const imageUrl = imagePath && baseUrl && !imagePath.startsWith('http')
      ? new URL(imagePath, baseUrl).toString()
      : imagePath || '';

    lines.push(`📌 *Producto ${index + 1}:* ${formatTitle(item.product.title)}`);
    lines.push(`🎨 *Color:* ${item.color}`);
    lines.push(`🔢 *Cantidad:* ${item.quantity} unidad/es`);
    if (item.product.price > 0) lines.push(`💵 *Precio unitario:* $${item.product.price}`);
    if (item.details) lines.push(`📝 *Detalles:* ${item.details}`);
    if (imageUrl) lines.push(`🖼️ *Referencia visual:* ${imageUrl}`);
    lines.push('');
  });
  lines.push('¡Espero tu respuesta para confirmar y empezar!');
  return lines.join('\n');
}

export default function Storefront() {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const visibleProducts = useMemo(() => {
    const query = search.toLowerCase();
    return products.filter((product) => {
      const matchesFilter = activeFilter === 'todos'
        ? true
        : activeFilter === 'personalizados'
          ? product.events.includes('personalizados')
          : activeFilter === 'invitaciones'
            ? product.events.includes('invitaciones')
            : product.events.includes(activeFilter) && !product.events.includes('personalizados');
      const matchesSearch = product.title.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  const sections = useMemo(() => {
    const grouped = visibleProducts.reduce<Record<string, Product[]>>((acc, product) => {
      const key = product.sectionTitle || 'Productos';
      if (!acc[key]) acc[key] = [];
      acc[key].push(product);
      return acc;
    }, {});

    const preferredOrder = [
      '🎂 Adornos para Pastel / Toppers',
      '🏺 Centros de mesa / Accesorios',
      '🏷️ Letreros con nombres personalizados',
      '🔑 Souvenirs: Adornos & Llaveros / Soporte exhibidor',
    ];

    const orderedSections = preferredOrder
      .filter((title) => grouped[title])
      .map((title) => ({ title, items: grouped[title] }));

    const otherSections = Object.entries(grouped)
      .filter(([title]) => !preferredOrder.includes(title))
      .map(([title, items]) => ({ title, items }));

    return [...orderedSections, ...otherSections];
  }, [visibleProducts]);

  const handleOpenMedia = (product: Product) => setSelectedMedia(product);

  const handleAddToCart = (product: Product, payload: { color: string; quantity: number; details: string }) => {
    setCart((prev) => {
      const index = prev.findIndex((item) => item.product.id === product.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], quantity: updated[index].quantity + payload.quantity, color: payload.color, details: payload.details || updated[index].details };
        return updated;
      }
      return [...prev, { product, ...payload }];
    });
  };

  const handleOrder = (product: Product) => {
    const message = makeWhatsAppMessage([{ product, quantity: 1, color: 'Dorado', details: '' }], window.location.origin);
    window.open(`https://wa.me/541131196403?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const message = makeWhatsAppMessage(cart, window.location.origin);
    window.open(`https://wa.me/541131196403?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleRemoveFromCart = (productId: string) => setCart((prev) => prev.filter((item) => item.product.id !== productId));

  return (
    <main>
      <div className="info-bar">🕒 Producción: 48-72hs | 🚚 Envíos a todo el país</div>

      <header>
        <div className="logo-container">
          <Image className="logo-img" src="/img/logo.ult.webp" alt="Logo IbisMaker 3D" width={160} height={160} priority />
        </div>
        <h1>IbisMaker 3D</h1>
        <div className="slogan">&quot;Tu imaginación en tres dimensiones&quot;</div>

        <div className="hero-banner hero-banner--video-only">
          <div className="hero-banner-media">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={promoProduct?.posterImage || promoProduct?.image || '/img/invitacion_digitalH.png'}
            >
              <source src="/videos/ibis_banner.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <a href="https://wa.me/541131196403" className="whatsapp-main" target="_blank" rel="noreferrer">
          <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.04 2C6.5 2 2 6.5 2 12.04c0 1.77.46 3.49 1.34 5L2 22l5.12-1.34c1.47.8 3.12 1.22 4.8 1.22 5.54 0 10.04-4.5 10.04-10.04C21.96 6.5 17.46 2 12.04 2M12 20.38c-1.57 0-3.11-.42-4.46-1.22l-.32-.19-3.32.87.88-3.23-.21-.33c-.88-1.39-1.34-3-1.34-4.66 0-4.64 3.78-8.4 8.41-8.4 2.25 0 4.36.88 5.95 2.46a8.3 8.3 0 0 1 2.46 5.94c0 4.64-3.77 8.41-8.4 8.41m4.6-6.2c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.15.17-.29.19-.54.06-1.07-.47-1.84-.87-2.58-2.14-.19-.34-.19-.66-.06-.8.12-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44c-.06-.12-.56-1.35-.77-1.84-.2-.48-.4-.41-.56-.41h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.62c.13.18 1.77 2.7 4.29 3.79.6.26 1.07.42 1.44.54.6.19 1.15.16 1.59.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.18-.48-.3" />
          </svg>
          Asesoramiento Directo WhatsApp
        </a>
      </header>

      <div className="search-container">
        <input className="search-input" type="text" placeholder="🔍 Buscar productos..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <p id="noResults" style={{ display: search && visibleProducts.length === 0 ? 'block' : 'none' }}>No encontramos productos con ese nombre...</p>
      </div>

      <div className="event-nav-container">
        <div className="event-nav-title">Elegí tu Evento para empezar a Diseñar</div>
        <div className="event-buttons">
          {events.map((event) => (
            <button key={event.id} className={`btn-event ${activeFilter === event.id ? 'active' : ''}`} onClick={() => setActiveFilter(event.id)}>
              {event.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container">
        {sections.map((section) => (
          <div key={section.title} className="product-section">
            <div className="section-header">
              <h2>{section.title}</h2>
            </div>
            {section.title === '💌 Invitaciones Digitales Personalizadas' ? (
              <>
                <p style={{ maxWidth: 850, margin: '0 0 24px 0', color: 'var(--silver-metal)', fontSize: '1rem', lineHeight: 1.7 }}>
                  Hacé que tus invitados vivan una experiencia diferente desde el primer momento. Diseñamos <strong style={{ color: 'var(--primary-cyan)' }}>Invitaciones Digitales Interactivas</strong> con animaciones, música, cuenta regresiva, ubicación del evento, confirmación de asistencia por WhatsApp y mucho más. También realizamos <strong style={{ color: 'var(--primary-cyan)' }}>Invitaciones Estáticas Premium</strong>, listas para compartir por WhatsApp o Redes Sociales. Todas son personalizadas para cualquier tipo de evento.
                </p>
                <div style={{ marginBottom: 20 }} />
              </>
            ) : null}
            <div className="grid-productos">
              {section.items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  layout="default"
                  onOpenMedia={handleOpenMedia}
                  onAddToCart={handleAddToCart}
                  onOrder={handleOrder}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="workflow-section" style={{ marginTop: 40 }}>
          <h2>🛠️ ¿Cómo Trabajamos?</h2>
          <div className="steps-grid">
            <div className="step-card"><h3>1. Elegí</h3><p>Configurás colores, cantidad y los nombres personalizados desde el catálogo.</p></div>
            <div className="step-card"><h3>2. Enviás tu Pedido</h3><p>Tocás el botón y se te genera automáticamente el mensaje listo para enviar a nuestro WhatsApp.</p></div>
            <div className="step-card"><h3>3. ¡Manos a la obra!</h3><p>Coordinamos la producción, confirmamos el diseño y en pocos días te lo enviamos.</p></div>
          </div>
        </div>

        <div style={{ marginTop: 35, textAlign: 'left', lineHeight: 1.8, color: 'var(--silver-metal)' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-cyan)', marginBottom: 15 }}>🎨 Nuestro Proceso Creativo</h2>
          <p style={{ marginBottom: 18 }}>
            En <strong style={{ color: 'var(--text-white)' }}>IbisMaker 3D</strong> transformamos tus ideas en objetos reales mediante tecnología de impresión 3D. Cada diseño se prepara cuidadosamente para lograr piezas con excelente terminación, precisión y resistencia, cuidando cada detalle antes de comenzar la fabricación.
          </p>
          <h3 style={{ color: 'var(--primary-cyan)', marginBottom: 12 }}>🧵 Materiales que utilizamos</h3>
          <p style={{ marginBottom: 15 }}><strong style={{ color: 'var(--text-white)' }}>PLA</strong><br />Material biodegradable de origen vegetal, ideal para souvenirs, adornos, toppers y decoración. Se destaca por su excelente calidad de impresión, gran nivel de detalle y acabado profesional.</p>
          <p style={{ marginBottom: 15 }}><strong style={{ color: 'var(--text-white)' }}>PETG</strong><br />Material de mayor resistencia mecánica y térmica. Es ideal para piezas que requieren mayor durabilidad sin perder una excelente calidad estética.</p>
          <div style={{ background: 'rgba(0,240,255,.08)', borderLeft: '4px solid var(--primary-cyan)', padding: 15, borderRadius: 8 }}>
            ✅ Tanto el <strong>PLA</strong> como el <strong>PETG</strong> son materiales ampliamente utilizados en impresión 3D. No son tóxicos en condiciones normales de uso y resultan ideales para productos decorativos y personalizados. Siempre recomendamos evitar exponer las piezas a temperaturas elevadas para conservar su forma y acabado.
          </div>
        </div>
      </div>

      <CartSidebar items={cart} onRemove={handleRemoveFromCart} />
      {cart.length > 0 ? (
        <button
          className="btn-pedir"
          onClick={handleCheckout}
          style={{ position: 'fixed', right: 20, bottom: 76, zIndex: 2001, width: 'auto', padding: '12px 18px', borderRadius: 999 }}
        >
          Enviar pedido por WhatsApp
        </button>
      ) : null}

      <MediaModal product={selectedMedia} onClose={() => setSelectedMedia(null)} />

      <footer>
        <p><strong>IbisMaker 3D</strong></p>
        <p>🎨 Diseños personalizados • Impresión 3D • Souvenirs • Decoración para eventos</p>
        <p>📍 Villa Tesei, Hurlingham, Buenos Aires, Argentina.</p>
        <p style={{ marginTop: 18 }}>Hecho con precisión tridimensional para tus momentos más especiales.</p>
        <p style={{ marginTop: 10, color: 'var(--text-muted)', fontSize: '.85rem' }}>© 2026 IbisMaker 3D - Todos los derechos reservados.</p>
      </footer>

      <button
        className="btn-scroll-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Volver arriba"
        title="Volver arriba"
      >
        ↑
      </button>
    </main>
  );
}
