"use client";

import { useState } from "react";
import { sendOTP, verifyOTP, addToCart } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function OTPForm() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const { login, loadCart } = useApp(); // ✅ USE CONTEXT

  /* =========================
     SEND OTP
  ========================= */
  const handleSendOTP = async () => {
    setError("");
    try {
      await sendOTP(phone);
      setSent(true);
    } catch {
      setError("Failed to send OTP");
    }
  };

  /* =========================
     VERIFY OTP + LOGIN
  ========================= */
  const handleVerifyOTP = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const data = await verifyOTP(phone, otp);
      console.log("LOGIN RESPONSE:", data);

      // ✅ LOGIN VIA CONTEXT (🔥 CRITICAL)
      login(data);

      // 🔁 SYNC GUEST CART → BACKEND
      const localCart =
        JSON.parse(localStorage.getItem("cart")) || [];

      for (const item of localCart) {
        await addToCart({
          product: { id: item.id },
          size: item.size,
          quantity: item.quantity,
        });
      }

      localStorage.removeItem("cart");

      // 🔥 RELOAD CART COUNT AFTER SYNC
      await loadCart();

      // ✅ REDIRECT
      router.replace(next);
    } catch {
      setError("Invalid or expired OTP");
      setLoading(false);
    }
  };

  return (
    <div className="border p-6 w-full max-w-sm rounded">
      <h2 className="text-lg font-bold mb-4">
        Login with Phone
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-3">
          {error}
        </p>
      )}

      {/* PHONE INPUT */}
      <input
        className="border p-2 w-full mb-3"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {!sent ? (
        <button
          onClick={handleSendOTP}
          className="bg-black text-white px-4 py-2 w-full rounded"
        >
          Send OTP
        </button>
      ) : (
        <>
          {/* OTP INPUT */}
          <input
            className="border p-2 w-full mb-3 mt-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="bg-black text-white px-4 py-2 w-full rounded"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
    </div>
  );
}
