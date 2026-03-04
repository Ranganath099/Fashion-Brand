"use client";

import { useEffect, useState } from "react";
import { fetchCart, removeCartItem, updateCartItem } from "@/lib/api";
import { removeFromLocalCart, updateLocalCart } from "@/lib/cartLocal";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus } from "lucide-react";

const SIZES = ["S", "M", "L", "XL"];

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [source, setSource] = useState("local");
  const router = useRouter();

  useEffect(() => {
    fetchCart().then((data) => {
      setItems(data.items || []);
      setSource(data.source || "local");
    });
  }, []);

  /* ------------------------
     UPDATE QUANTITY
  ------------------------- */
  const updateQty = async (item, index, qty) => {
    if (qty < 1) return;

    if (source === "local") {
      setItems(updateLocalCart(index, { quantity: qty }));
      return;
    }

    await updateCartItem(item.id, { quantity: qty });
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, quantity: qty } : i
      )
    );
  };

  /* ------------------------
     UPDATE SIZE
  ------------------------- */
  const updateSize = async (item, index, size) => {
    if (source === "local") {
      setItems(updateLocalCart(index, { size }));
      return;
    }

    await updateCartItem(item.id, { size });
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, size } : i
      )
    );
  };

  /* ------------------------
     REMOVE ITEM
  ------------------------- */
  const handleRemove = async (item, index) => {
    if (source === "local") {
      setItems(removeFromLocalCart(index));
      return;
    }

    await removeCartItem(item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        /* EMPTY CART */
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            Your cart is empty 🛒
          </p>

          <button
            onClick={() => router.push("/collections")}
            className="
              px-6 py-3 rounded-full font-medium
              bg-gray-900 text-white
              hover:bg-gray-800
              dark:bg-gray-100 dark:text-black
              dark:hover:bg-gray-200
              transition
            "
          >
            Shop Now →
          </button>
        </div>
      ) : (
        <>
          {items.map((item, index) => (
            <div
              key={index}
              className="
                flex justify-between items-center
                border-b border-gray-200 dark:border-gray-700
                py-4
              "
            >
              {/* LEFT */}
              <div className="space-y-2">
                <p className="font-medium">
                  {item.name || item.product_name}
                </p>

                {/* SIZE SELECT */}
                <select
                  value={item.size}
                  onChange={(e) =>
                    updateSize(item, index, e.target.value)
                  }
                  className="
                    px-2 py-1 text-sm rounded-md
                    bg-white dark:bg-gray-900
                    border border-gray-300 dark:border-gray-700
                    text-gray-900 dark:text-gray-100
                  "
                >
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {/* QUANTITY */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQty(item, index, item.quantity - 1)
                    }
                    className="
                      p-1 rounded-md
                      border border-gray-300 dark:border-gray-700
                      hover:bg-gray-100 dark:hover:bg-gray-800
                    "
                  >
                    <Minus size={16} />
                  </button>

                  <span className="min-w-20px text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQty(item, index, item.quantity + 1)
                    }
                    className="
                      p-1 rounded-md
                      border border-gray-300 dark:border-gray-700
                      hover:bg-gray-100 dark:hover:bg-gray-800
                    "
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">
                <p className="font-medium">
                  ₹ {item.price * item.quantity}
                </p>

                <button
                  onClick={() => handleRemove(item, index)}
                  className="
                    p-2 rounded-md
                    text-red-600 dark:text-red-400
                    hover:bg-red-50 dark:hover:bg-red-900/20
                  "
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {/* CHECKOUT */}
          <button
            onClick={() => {
              const token = localStorage.getItem("accessToken");
              if (!token) {
                router.push("/login?next=/checkout");
              } else {
                router.push("/checkout");
              }
            }}
            className="
              mt-6 w-full py-3 rounded-md font-medium
              bg-gray-900 text-white
              hover:bg-gray-800
              dark:bg-gray-100 dark:text-black
              dark:hover:bg-gray-200
              transition
            "
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
