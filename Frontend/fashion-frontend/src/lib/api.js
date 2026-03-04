const API = process.env.NEXT_PUBLIC_API_URL;

/* =========================
   PRODUCTS
========================= */
export async function fetchProducts() {
  const res = await fetch(`${API}/api/products/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(slug) {
  const res = await fetch(`${API}/api/products/${slug}/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

/* =========================
   COLLECTIONS
========================= */
export async function fetchCollections() {
  const res = await fetch(`${API}/api/collection/`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

/* =========================
   AUTH (OTP)
========================= */
export async function sendOTP(phone) {
  const res = await fetch(`${API}/api/users/send-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  return res.json();
}

export async function verifyOTP(phone, otp) {
  const res = await fetch(`${API}/api/users/verify-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });
  return res.json();
}


/* =========================
   CART REMOVE (BACKEND)
========================= */
export async function removeCartItem(itemId) {
  const token = localStorage.getItem("accessToken");

  // 🟢 Guest users
  if (!token) {
    window.dispatchEvent(new Event("cartUpdated"));
    return;
  }

  await fetch(`${API}/api/cart/remove/${itemId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // ✅ MUST notify AppContext
  window.dispatchEvent(new Event("cartUpdated"));
}


export async function updateCartItem(itemId, payload) {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  await fetch(`${API}/api/cart/update/${itemId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  // ✅ MUST notify AppContext
  window.dispatchEvent(new Event("cartUpdated"));
}



/* =========================
   CART (BACKEND)
========================= */
export async function addToCart({ product, size, quantity }) {
  const token = localStorage.getItem("accessToken");

  // 🟢 GUEST USER → localStorage
  if (!token) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      (i) => i.id === product.id && i.size === size
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image:
          product.images?.find((img) => img.is_primary)?.image ||
          product.images?.[0]?.image,
        size,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    return;
  }

  // 🟢 LOGGED-IN USER → backend
  await fetch(`${API}/api/cart/add/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      product_id: product.id,
      size,
      quantity,
    }),
  });

  window.dispatchEvent(new Event("cartUpdated"));
}


export async function fetchCart() {
  const token = localStorage.getItem("accessToken");

  // 🟢 Guest user → localStorage cart
  if (!token) {
    return {
      items: JSON.parse(localStorage.getItem("cart")) || [],
      source: "local",
    };
  }

  // 🟢 Logged-in user → backend cart
  const res = await fetch(`${API}/api/cart/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    // fallback instead of crash
    return {
      items: JSON.parse(localStorage.getItem("cart")) || [],
      source: "local",
    };
  }

  const data = await res.json();
  return { ...data, source: "backend" };
}

/* =========================
   ORDERS
========================= */
export async function createOrder() {
  const token = localStorage.getItem("accessToken");

  return fetch(`${API}/api/orders/create/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchMyOrders() {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API}/api/orders/my-orders/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}
