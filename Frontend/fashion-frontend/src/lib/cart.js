export const getCart = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const addToCart = (product) => {
  const cart = getCart();

  const existing = cart.find((item) => item.id === product.id);

  let updated;
  if (existing) {
    updated = cart.map((item) =>
      item.id === product.id
        ? { ...item, qty: item.qty + 1 }
        : item
    );
  } else {
    updated = [
      ...cart,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image:
          product.images?.find((img) => img.is_primary)?.image ||
          product.images?.[0]?.image,
        qty: 1,
      },
    ];
  }

  localStorage.setItem("cart", JSON.stringify(updated));
  return updated;
};

export const getCartCount = () =>
  getCart().reduce((sum, item) => sum + item.qty, 0);
