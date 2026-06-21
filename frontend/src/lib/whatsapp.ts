const fallbackNumber = "254700000000";

export function whatsappLink(productName = "a product") {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || fallbackNumber;
  const message = `Hi Laces & Heels, I would like to check availability for ${productName}.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
