"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images, name }) {
  const [current, setCurrent] = useState(0);

  const prevImage = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* MAIN IMAGE */}
      <div className="relative group border rounded overflow-hidden aspect-3/4 bg-gray-100 dark:bg-gray-900">
        <Image
          src={images[current].image}
          alt={name}
          width={600}
          height={600}
          className="object-cover object-center transition-transform duration-300 group-hover:scale-110 cursor-pointer"
          unoptimized
        />

        {/* LEFT ARROW */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow "
        >
          <ChevronLeft size={20} />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`border rounded ${
              current === index ? "ring-2 ring-black" : ""
            }`}
          >
            <Image
              src={img.image}
              alt={`${name} ${index + 1}`}
              width={80}
              height={80}
              className="object-cover"
              unoptimized
            />
          </button>
        ))}
      </div>
    </div>
  );
}
