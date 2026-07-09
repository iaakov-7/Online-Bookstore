export function validateAddToCart(customerId, productId, quantity) {
  const errors = [];
  if (!customerId || typeof customerId !== "number") {
    errors.push("customerId is required and must be a number");
  }
  if (!productId || typeof productId !== "number") {
    errors.push("productId is required  and must be a number");
  }
  if (!quantity || !Number.isInteger(quantity) || quantity < 0) {
    errors.push("quantity is required and must be a positive integer");
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}
