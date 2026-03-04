import { fetchCollections, fetchProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

/* =========================
   SEO METADATA
========================= */
export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ FIX

  const collections = await fetchCollections();
  const collection = collections.find((c) => c.slug === slug);

  if (!collection) return {};

  return {
    title: `${collection.name} Collection | Fashion Store`,
    description: `Shop products from our ${collection.name} collection.`,
  };
}

/* =========================
   PAGE
========================= */
export default async function CollectionSlugPage({ params }) {
  const { slug } = await params; // ✅ FIX

  const collections = await fetchCollections();
  const products = await fetchProducts();

  const collection = collections.find((c) => c.slug === slug);

  if (!collection) {
    notFound();
  }

  const collectionProducts = products.filter(
    (p) => p.collection?.id === collection.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
        {collection.name}
      </h1>

      <p className="text-sm sm:text-base text-gray-600 mb-6">
        Explore products from the {collection.name} collection.
      </p>


      {collectionProducts.length === 0 ? (
        <p>No products available in this collection.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">

          {collectionProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}



// import { notFound } from "next/navigation";
// import { fetchCollections, fetchProducts } from "@/lib/api";

// /* =========================
//    Metadata
// ========================= */
// export async function generateMetadata({ params }) {
//   const { slug } = await params; // ✅ FIX

//   return {
//     title: `${slug} | Collection`,
//   };
// }

// /* =========================
//    Page
// ========================= */
// export default async function CollectionSlugPage({ params }) {
//   const { slug } = await params; // ✅ FIX

//   if (!slug) notFound();

//   const collections = await fetchCollections();
//   const products = await fetchProducts();

//   const collection = collections.find((c) => c.slug === slug);

//   if (!collection) notFound();

//   const filteredProducts = products.filter(
//     (p) => p.collection === collection.id
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-4">{collection.name}</h1>

//       {filteredProducts.length === 0 ? (
//         <p>No products found</p>
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {filteredProducts.map((product) => (
//             <div key={product.id} className="border p-3 rounded">
//               <p>{product.name}</p>
//               <p>₹{product.price}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
