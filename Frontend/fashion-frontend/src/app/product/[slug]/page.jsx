import Image from "next/image";
import { fetchProduct } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import SizeChart from "@/components/SizeChart";
import AddToCartButton from "@/components/AddToCartButton";
/* =========================
   SEO METADATA
========================= */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const product = await fetchProduct(slug);
  if (!product || !product.images?.length) return {};
console.log("COLLECTION:", product.collection);
  const primaryImage =
    product.images.find((img) => img.is_primary) ||
    product.images[0];

  return {
    title: `${product.name} | Fashion Store`,
    description: product.description?.slice(0, 150),
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: primaryImage.image }],
    },
  };
}

/* =========================
   PAGE
========================= */
export default async function ProductPage({ params }) {
  const { slug } = await params;

  const product = await fetchProduct(slug);
  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">

      {/* LEFT: IMAGE GALLERY */}
      <ProductGallery
        images={product.images}
        name={product.name}
      />

      {/* RIGHT: PRODUCT DETAILS */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2 whitespace-pre-line">{product.description}</p>
          <p className="text-2xl font-bold mt-4">₹ {product.price}</p>
        </div>

        {/* SIZE CHART */}
        <SizeChart collection={product.collection} />


        {/* ACTION */}
     <AddToCartButton  product={product}></AddToCartButton>

      </div>
    </div>
  );
}
