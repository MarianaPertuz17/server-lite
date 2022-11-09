import moment from 'moment';

export const generateHeader = (doc: PDFKit.PDFDocument, name: string) => {
  doc
    .rect(0, 0, doc.page.width, doc.page.height)
    .fill('lightgray')
    .image('assets/images/Lite.JPG', 0, 0, { width: 100 })
    .moveDown()
    .fillColor('#00000')
    .fontSize(20)
    .text(name, 10, 120)
    .fontSize(10)
    .moveDown();
};

const generateHr = (doc: PDFKit.PDFDocument, y: number) => {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(570, y).stroke();
};

const generateTableRow = (
  doc: PDFKit.PDFDocument,
  y: number,
  c1: string,
  c2: string
) => {
  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 180, y);
  generateHr(doc, y + 20);
};

const generateTableRowTitles = (
  doc: PDFKit.PDFDocument,
  y: number,
  c1: string,
  c2: string
) => {
  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 180, y);
  generateHr(doc, y + 20);
};

export const generateFooter = (doc: PDFKit.PDFDocument, currentHeight: number, name: string) => {
    doc
    .fontSize(16)
    .text(
      `These are the articles in ${
        name
      }'s inventory as of ${moment(new Date()).format(
        'MMMM Do YYYY, h:mm:ss a'
      )}.`,
      10,
      currentHeight + 50
    );
};

export const generateInvoiceTable = (doc: PDFKit.PDFDocument, data: any) => {
  const tableTop = 230;
  doc.font('Helvetica-Bold');
  generateTableRowTitles(
    doc,
    tableTop,
    'Item Name',
    'Quantity'
  );
  doc.font('Helvetica');
  generateHr(doc, tableTop + 20);
  let positionTracker = tableTop + 30;
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const position = tableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.productName,
      item.quantity
    );
    positionTracker = position;
  }
  return positionTracker;
};