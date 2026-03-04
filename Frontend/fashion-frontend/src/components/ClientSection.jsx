// "use client";

// import { useState } from "react";
// import ProductCard from "@/components/ProductCard";
// import CollectionList from "@/components/CollectionList";

// export default function ClientSection({ collections, products }) {
//   const [selected, setSelected] = useState(null);

//   const filteredProducts = selected
//     ? products.filter((p) => p.collection === selected)
//     : products;

//   return (
//     <>
//       <CollectionList
//         collections={collections}
//         onSelect={setSelected}
//         selected={selected}
//      />

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {filteredProducts.map((p) => (
//           <ProductCard key={p.id} product={p} />
//         ))}
//       </div>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import CollectionList from "@/components/CollectionList";

export default function ClientSection({ collections, products }) {
  // ✅ show only first 4 collections
  const visibleCollections = collections.slice(0, 4);

  // ✅ auto select first collection
  const [selected, setSelected] = useState(
    visibleCollections[0]?.id || null
  );

  // 🔥 filter products
  const filteredProducts = products.filter(
    (p) => p.collection === selected
  );

  return (
    <section className="space-y-6 sm:space-y-8">
      {/* COLLECTION TABS */}
      <CollectionList
        collections={visibleCollections}
        onSelect={setSelected}
        selected={selected}
      />

      {/* PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-sm sm:text-base text-gray-500 py-12">
          No products available in this collection.
        </p>
      ) : (
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            gap-4 sm:gap-6
            transition-opacity duration-300
          "
        >
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
