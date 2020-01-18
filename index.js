const { createInvoice } = require("./invoice.js");

const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 ZAPR Street",
    city: "Bangalore",
    state: "CA",
    country: "US",
    postal_code: 94111
  },
  items: [
    {
      item: "TC 100",
      description: "Toner Cartridge",
      quantity: 2,
      amount: 6000
    },
    {
      item: "USB_EXT",
      description: "USB Cable Extender",
      quantity: 1,
      amount: 2000
    }
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234,
  GSTIN: '0a1b2c3d4e56789'
};

createInvoice(invoice, "invoice.pdf");