export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const calculateSubtotal = (price: number, quantity: number): number => {
  return Math.round(price * quantity * 100) / 100;
};

export const calculateOrderTotal = (items: { price: number; quantity: number }[]): number => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Math.round(total * 100) / 100;
};
