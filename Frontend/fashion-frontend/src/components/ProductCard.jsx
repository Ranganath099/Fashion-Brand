// import Image from "next/image";
// import Link from "next/link";

// export default function ProductCard({ product }) {
//   // ✅ get primary image or fallback
//   const primaryImage =
//     product.images?.find((img) => img.is_primary) ||
//     product.images?.[0];

//   return (
//     <Link href={`/product/${product.slug}`}>
//       <div className="relative w-full aspect-3/4 overflow-hidden bg-gray-100 dark:bg-gray-900">
//         {primaryImage && (
//           <Image
//             src={primaryImage.image}
//             alt={product.name}
//             width={400}
//             height={300}
//             className="object-cover object-center transition-transform duration-300 hover:scale-105"
//             unoptimized
//           />
//         )}

//         <div className="p-4">
//           <h3 className="font-semibold">{product.name}</h3>
//           <p className="text-sm text-gray-600 line-clamp-2">
//             {product.description}
//           </p>
//           <p className="font-bold mt-2">₹ {product.price}</p>
//         </div>
//       </div>
//     </Link>
//   );
// }

import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  // ✅ get primary image or fallback
  const primaryImage =
    product.images?.find((img) => img.is_primary) ||
    product.images?.[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group border rounded-xl overflow-hidden
                 hover:shadow-lg transition bg-white dark:bg-black"
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-900">
        {primaryImage && (
          <Image
            src={primaryImage.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300
                       group-hover:scale-105"
            unoptimized
          />
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2 h-full">
        <h3 className="font-medium text-sm line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          ₹ {product.price}
        </p>
      </div>
    </Link>
  );
}
