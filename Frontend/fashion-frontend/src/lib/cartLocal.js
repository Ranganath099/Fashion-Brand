export function removeFromLocalCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
  return cart;
}

export function updateLocalCart(index, updates) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart[index] = {
    ...cart[index],
    ...updates,
    quantity: Math.max(1, updates.quantity ?? cart[index].quantity),
  };

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
  return cart;
}