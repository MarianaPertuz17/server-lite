import { Request, Response } from 'express';
import { Company } from '../models/company';

interface ICompanyGetRequest extends Request {
  params: {
    companyId: string;
  };
}

const getCompanies = async (_: Request, res: Response) => {
  try {
    const companies = await Company.findAll();
    res.status(200).json({ res: companies, error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const getCompany = async (req: ICompanyGetRequest, res: Response) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findOne({where: {NIT: companyId}, include: 'products'});
    res.status(200).json({ res: company, error: false });
  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};


export { getCompanies, getCompany };