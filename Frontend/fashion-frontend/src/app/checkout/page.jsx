"use client";

import { createOrder } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const placeOrder = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login?next=/checkout");
      return;
    }

    try {
      await createOrder();
      router.push("/orders");
    } catch (err) {
      alert("Failed to place order");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Confirm Order</h1>

      <button
        onClick={placeOrder}
        className="w-full py-3 bg-black text-white rounded"
      >
        Place Order
      </button>
    </div>
  );
}
