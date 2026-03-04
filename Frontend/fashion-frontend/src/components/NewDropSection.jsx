import { fetchCollections, fetchProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "New Drop | Fashion Store",
  description: "Explore our latest new drop collections and products.",
};

export default async function NewDropSection({ limit }) {
  const collections = await fetchCollections();
  const products = await fetchProducts();

  // 🔥 New collections only
  const newCollections = collections.filter((c) => c.is_new === true);

  // 🔥 New collection IDs
  const newCollectionIds = newCollections.map((c) => c.id);

  // 🔥 New products only (FIXED)
  const newDropProducts = products
    .filter((p) => newCollectionIds.includes(p.collection?.id))
    .sort((a, b) => b.id - a.id);

  // ✅ LIMIT HANDLING
  const limitedProducts = limit
    ? newDropProducts.slice(0, limit)
    : newDropProducts;

  return (
    <div className="space-y-12 sm:space-y-16">
      {newCollections.map((collection) => {
        const productsOfCollection = limitedProducts.filter(
          (p) => p.collection?.id === collection.id
        );

        if (productsOfCollection.length === 0) return null;

        return (
          <section key={collection.id}>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6">
              {collection.name}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {productsOfCollection.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
