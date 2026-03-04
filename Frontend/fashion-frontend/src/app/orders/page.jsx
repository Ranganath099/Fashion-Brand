"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [cancelFor, setCancelFor] = useState(null); // order id
  const [reason, setReason] = useState("");
  const router = useRouter();

  /* =====================
     FETCH ORDERS
  ===================== */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login?next=/orders");
      return;
    }

    fetch("http://127.0.0.1:8000/api/orders/my-orders/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [router]);

  /* =====================
     CONFIRM CANCEL
  ===================== */
  const confirmCancel = async (orderId) => {
    if (!reason) {
      alert("Please select a reason");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/orders/cancel/${orderId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Cancel failed");
        return;
      }

      // update UI
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                order_status: "CANCELLED",
                is_cancelled: true,
                cancel_reason: reason,
                cancelled_at: new Date().toISOString(),
              }
            : o
        )
      );

      // reset
      setCancelFor(null);
      setReason("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  /* =====================
     HELPERS
  ===================== */
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "-";

  const formatReason = (r) =>
    r
      ? r
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(/^\w/, (c) => c.toUpperCase())
      : "-";

 return (
  <div className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
    <h1 className="text-xl font-bold mb-4">My Orders</h1>

    {orders.length === 0 && (
      <p className="text-gray-500 dark:text-gray-400">
        No orders found.
      </p>
    )}

    {orders.map((order) => (
      <div
        key={order.id}
        className="
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          rounded p-4 mb-4 space-y-2
        "
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <p className="font-semibold">
            Order ID: {order.id}
          </p>

          <span
            className={`
              text-sm px-3 py-1 rounded-full
              ${
                order.order_status === "CANCELLED"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
              }
            `}
          >
            {order.order_status}
          </span>
        </div>

        {/* TIME */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🕒 Ordered on:{" "}
          <b>{formatDate(order.created_at)}</b>
        </p>

        {/* CANCEL INFO */}
        {order.is_cancelled && (
          <p className="text-sm text-red-600 dark:text-red-400">
            ❌ Cancelled on: {formatDate(order.cancelled_at)} <br />
            Reason: {formatReason(order.cancel_reason)}
          </p>
        )}

        <p className="text-sm">
          Payment Status:{" "}
          <span className="font-medium">
            {order.payment_status}
          </span>
        </p>

        <p className="font-semibold">
          Total: ₹{order.total_amount}
        </p>

        {/* CANCEL ACTION */}
        {!order.is_cancelled &&
          order.order_status !== "DELIVERED" && (
            <>
              {cancelFor === order.id ? (
                <div className="mt-3 space-y-2">
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="
                      w-full p-2 rounded
                      border border-gray-300 dark:border-gray-600
                      bg-white dark:bg-gray-800
                      text-gray-900 dark:text-gray-100
                    "
                  >
                    <option value="">Select cancel reason</option>
                    <option value="COLOR_MISMATCH">
                      Color mismatch
                    </option>
                    <option value="WRONG_SIZE">
                      Wrong size
                    </option>
                    <option value="ADDRESS_CHANGE">
                      Address change
                    </option>
                    <option value="OTHER">Other</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmCancel(order.id)}
                      className="
                        px-4 py-2 rounded
                        bg-red-600 hover:bg-red-700
                        dark:bg-red-700 dark:hover:bg-red-800
                        text-white
                      "
                    >
                      Confirm Cancel
                    </button>

                    <button
                      onClick={() => {
                        setCancelFor(null);
                        setReason("");
                      }}
                      className="
                        px-4 py-2 rounded
                        bg-gray-200 hover:bg-gray-300
                        dark:bg-gray-700 dark:hover:bg-gray-600
                        text-gray-900 dark:text-gray-100
                      "
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setCancelFor(order.id)}
                  className="
                    mt-2 px-4 py-2 rounded
                    bg-red-600 hover:bg-red-700
                    dark:bg-red-700 dark:hover:bg-red-800
                    text-white
                  "
                >
                  Cancel Order
                </button>
              )}
            </>
          )}

        {/* ITEMS */}
        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
          {order.items.map((item, idx) => (
            <p
              key={idx}
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              {item.product_name} ({item.size}) ×{" "}
              {item.quantity} – ₹{item.price}
            </p>
          ))}
        </div>
      </div>
    ))}
  </div>
);

}
