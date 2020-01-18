const fs = require("fs");
const PDFDocument = require("pdfkit");
////////////////test
const data = {
    shipping: {
      name: "John Doe",
      address: "1234 Main Street",
      city: "San Francisco",
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
    GSTIN: "123456ed7c8b9a0"
  };
  //In the above object, we have a shipping key that 

////////////////////
const invoiceShippingCreadentials = data => {
  console.log("Contains user details");
  return {
    shipping: {
        name: data.shipping.name,
        address: data.shipping.address,
        city: data.shipping.city,
        state: data.shipping.state,
        country: data.shipping.country,
        postalCode: data.shipping.postalCode
      },
      items: [
        {
          item: data.items.item,
          description: data.items.description,
          quantity: data.items.quantity,
          amount: data.items.amount
        }
        
      ],
      subtotal: data.subtotal,
      paid: data.paid,
      invoiceNr: data.invoiceNr,
      GSTIN: data.GSTIN
    
  };
};

module.exports = {
  invoiceShippingCreadentials
};
let doc = new PDFDocument({ size: "A4", margin: 50 });

function createInvoice(data, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

   generateHeader(doc);
  generateCustomerInformation(doc, data);
  generateInvoiceTable(doc, data);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(data, path) {
  doc
    .image("logo.jpeg", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("B2B Inc.", 110, 57)
    .fontSize(10)
    .text("B2B Inc.", 200, 50, { align: "right" })
    .text(data.address, 200, 65, { align: "right" })
    .text(data.city, data.state, 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, data) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(data.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(data.subtotal - data.paid),
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(data.shipping.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(data.shipping.address, 300, customerInformationTop + 15)
    .text(
      data.shipping.city +
        ", " +
        data.shipping.state +
        ", " +
        data.shipping.country,
      300,
      customerInformationTop + 30
    )
    .font("Helvetica-Bold")
    .text("GSTIN:" + " " +
    data.GSTIN, 400, customerInformationTop)
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, data) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(data.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(data.paid)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(data.subtotal - data.paid)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

console.log(createInvoice(data,'invoice.pdf'));

module.exports = {
  createInvoice
};