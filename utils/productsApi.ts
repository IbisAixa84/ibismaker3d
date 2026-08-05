import axios from 'axios';
import { products as fallbackProducts, type Product } from '@/data/products';

const API_BASE_URL = process.env.API_URL || 'http://localhost:8080';
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/api/products`;

// Si la API no contesta en este tiempo, usamos el catálogo local.
const REQUEST_TIMEOUT_MS = 3000;

// La API pagina (estilo Spring). Pedimos una página grande para traer todo de una.
const PAGE_SIZE = 200;

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string' && value.trim()) return value.split(',').map((item) => item.trim());
  return [];
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

// La API puede nombrar los campos distinto (id/nombre/precio...), así que
// aceptamos las variantes más probables y descartamos lo que no sirve.
function normalizeProduct(raw: Record<string, any>): Product | null {
  const identifier = raw.identifier ?? raw.id ?? raw.codigo;
  const title = raw.title ?? raw.name ?? raw.nombre;
  if (!identifier || !title) return null;

  return {
    identifier: String(identifier),
    title: String(title),
    events: toStringArray(raw.events ?? raw.eventos),
    image: toOptionalString(raw.image ?? raw.imageUrl ?? raw.imagen) ?? '/img/logo.ult.webp',
    imageAlt: toOptionalString(raw.imageAlt ?? raw.alt),
    posterImage: toOptionalString(raw.posterImage ?? raw.poster),
    important: String(raw.important ?? raw.description ?? raw.descripcion ?? ''),
    price: Number(raw.price ?? raw.precio ?? 0) || 0,
    colors: toStringArray(raw.colors ?? raw.colores),
    detailsLabel: toOptionalString(raw.detailsLabel),
    placeholder: toOptionalString(raw.placeholder),
    // Una categoría desconocida se renderiza como producto común (sin botones especiales).
    category: (toOptionalString(raw.category ?? raw.categoria) ?? 'general') as Product['category'],
    variant: raw.variant === 'video' || raw.variant === 'image' ? raw.variant : undefined,
    videoSrc: toOptionalString(raw.videoSrc ?? raw.video),
    ctaLabel: toOptionalString(raw.ctaLabel),
    sectionTitle: toOptionalString(raw.sectionTitle ?? raw.seccion),
  };
}

// Algunos backends devuelven el array directo y otros lo envuelven.
function extractList(data: unknown): unknown[] | null {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const wrapper = data as Record<string, unknown>;
    for (const key of ['content', 'products', 'data', 'items']) {
      if (Array.isArray(wrapper[key])) return wrapper[key] as unknown[];
    }
  }
  return null;
}

// `totalPages` puede venir en la raíz o dentro de `page`, según la versión del backend.
function extractTotalPages(data: unknown): number {
  if (!data || typeof data !== 'object') return 1;
  const wrapper = data as Record<string, any>;
  const total = wrapper.totalPages ?? wrapper.page?.totalPages;
  return Number.isFinite(Number(total)) && Number(total) > 0 ? Number(total) : 1;
}

function fetchPage(page: number) {
  return axios.get(PRODUCTS_ENDPOINT, {
    timeout: REQUEST_TIMEOUT_MS,
    params: { page, size: PAGE_SIZE },
  });
}

/**
 * Trae los productos de la API. Si la API no responde, responde con un error,
 * o devuelve algo inesperado, cae al catálogo local de `data/products.ts`.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await fetchPage(0);

    const list = extractList(data);
    if (!list) {
      console.warn(`[productsApi] Respuesta inesperada de ${PRODUCTS_ENDPOINT}. Uso el catálogo local.`);
      return fallbackProducts;
    }

    // Por si el backend ignora `size` y devuelve páginas más chicas de lo pedido.
    const totalPages = extractTotalPages(data);
    if (totalPages > 1) {
      const restPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) => fetchPage(index + 1)),
      );
      restPages.forEach((response) => list.push(...(extractList(response.data) ?? [])));
    }

    const normalized = list
      .map((item) => normalizeProduct(item as Record<string, any>))
      .filter((item): item is Product => item !== null);

    if (normalized.length === 0) {
      console.warn(`[productsApi] La API no devolvió productos válidos. Uso el catálogo local.`);
      return fallbackProducts;
    }

    return normalized;
  } catch (error) {
    const detail = axios.isAxiosError(error) ? error.message : String(error);
    console.warn(`[productsApi] No pude leer ${PRODUCTS_ENDPOINT} (${detail}). Uso el catálogo local.`);
    return fallbackProducts;
  }
}
