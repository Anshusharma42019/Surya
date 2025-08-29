export const generateInvoice = (order) => {
  const invoice = {
    invoiceNumber: order.invoiceNumber,
    date: new Date(order.createdAt).toLocaleDateString(),
    time: new Date(order.createdAt).toLocaleTimeString(),
    customer: {
      name: order.customerName,
      phone: order.customerPhone,
    },
    items: order.items.map((item) => ({
      description: item.itemName,
      category: item.category,
      qty: item.quantity,
      rate: item.unitPrice,
      discount: order.discount || 0,
      tax: order.tax || 0,
      amount: item.totalPrice,
    })),
    subtotal: order.subtotal,
    discount: order.discount,
    tax: order.tax,
    totalAmount: order.totalAmount,
    currency: "INR",
  };

  return invoice;
};
