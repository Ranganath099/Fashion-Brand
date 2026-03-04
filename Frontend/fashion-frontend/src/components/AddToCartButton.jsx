"use client";

import { useState } from "react";
import { addToCart } from "@/lib/api";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function AddToCartButton({ product }) {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);

  const handleAdd = async () => {
    if (!size) return alert("Please select a size");

    await addToCart({ product, size, quantity: qty });
    window.dispatchEvent(new Event("cartUpdated"));

    setOpen(false);
    setSize("");
    setQty(1);
  };

  return (
    <>
      {/* MAIN BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="
          w-full py-3 rounded-md font-medium
          bg-gray-900 text-white
          hover:bg-gray-800
          dark:bg-gray-100 dark:text-black
          dark:hover:bg-gray-200
          transition
          cursor-pointer
        "
      >
        Add to Cart
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="
              w-full max-w-sm p-6 rounded-lg space-y-4
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              border border-gray-200 dark:border-gray-700
            "
          >
            <h3 className="text-lg font-semibold">
              Select Size & Quantity
            </h3>

            {/* SIZE */}
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`
                    px-3 py-1 rounded-md border text-sm
                    transition
                    ${
                      size === s
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-black"
                        : "border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* QTY */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="
                  w-8 h-8 rounded border
                  border-gray-300 dark:border-gray-700
                  hover:bg-gray-100 dark:hover:bg-gray-800
                "
              >
                −
              </button>

              <span className="font-medium">{qty}</span>

              <button
                onClick={() => setQty(qty + 1)}
                className="
                  w-8 h-8 rounded border
                  border-gray-300 dark:border-gray-700
                  hover:bg-gray-100 dark:hover:bg-gray-800
                "
              >
                +
              </button>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="
                  flex-1 py-2 rounded-md border
                  border-gray-300 dark:border-gray-700
                  hover:bg-gray-100 dark:hover:bg-gray-800
                "
              >
                Cancel
              </button>

              <button
                onClick={handleAdd}
                className="
                  flex-1 py-2 rounded-md font-medium
                  bg-gray-900 text-white
                  hover:bg-gray-800
                  dark:bg-gray-100 dark:text-black
                  dark:hover:bg-gray-200
                "
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
