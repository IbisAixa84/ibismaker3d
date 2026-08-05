import Storefront from '@/components/Storefront';
import { getProducts } from '@/utils/productsApi';

// Consultamos la API en cada request: si se generara estáticamente,
// el build congelaría el catálogo local como si fuera el de la API.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getProducts();
  return <Storefront products={products} />;
}
