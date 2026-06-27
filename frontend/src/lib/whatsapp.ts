const fallbackNumber = "254700709002";

export function whatsappLink(productName = "a product") {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || fallbackNumber;
  const message = `Hi Laces & Heels, I would like to check availability for ${productName}.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function cartCheckoutLink(items: Array<{ name: string; price: string; quantity: number }>) {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || fallbackNumber;

  const itemLines = items.map((item, i) => `  ${i + 1}. ${item.name} (${item.quantity}x) — ${item.price}`).join("\n");
  const message =
    `Hi Laces & Heels! 👋 I'd like to order the following items:\n\n` +
    `${itemLines}\n\n` +
    `Please confirm availability, colours, and delivery/pickup options. Thank you!`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
