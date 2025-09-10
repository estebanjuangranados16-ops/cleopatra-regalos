export const parsePrice = (price: string | number): number => {
  if (typeof price === 'number') {
    return price;
  }
  
  // Remove currency symbols and convert to number
  const cleanPrice = price.replace(/[$.,]/g, '');
  return parseFloat(cleanPrice) || 0;
};

export const formatPrice = (price: string | number): string => {
  const numPrice = parsePrice(price);
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(numPrice);
};