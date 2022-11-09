import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { Company } from '../models/company';
import { generateFooter, generateHeader, generateInvoiceTable } from '../utils/pdf';

interface IPDFReportRequest extends Request {
  params: {
    companyId: string;
  };
}

interface IProduct {
  id: number;
  companyId: string;
  productName: string;
  quantity: number;
}

interface ICompanyWithProducts extends Company {
  products: IProduct[];
}

const generatePDFReport = async (req: IPDFReportRequest, res: Response) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findOne({ where: { NIT: companyId }, include: 'products'});
    if (!company)
      return res
        .status(400)
        .send({ res: 'Company does not exist', error: true });

    const doc = new PDFDocument();

    const companyWithProducts = (company as ICompanyWithProducts);
    generateHeader(doc, `Global Report for Company with NIT: ${companyId}`);
    const currentHeight = generateInvoiceTable(doc, companyWithProducts.products);
    generateFooter(doc, currentHeight, company.name);

    doc.pipe(res);
    doc.end();
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

export { generatePDFReport };
