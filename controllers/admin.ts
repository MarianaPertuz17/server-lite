import { Request, Response } from 'express';
import { Company } from '../models/company';
import { NITValidator, phoneValidator } from '../utils';

interface ICompanyBody {
  NIT: string;
  name: string;
  address: string;
  phone: string;
}

interface ICompanyRequest extends Request {
  body: ICompanyBody;
}

interface ICompanyDeleteRequest extends Request {
  body: {
    NIT: string;
  };
}

const createCompany = async (req: ICompanyRequest, res: Response) => {
  try {
    const { NIT, name, address, phone } = req.body;

    if (!NIT || !name || !address || !phone) {
      return res.status(400).send({res: 'Missing form fields!', error: true});
    }

    if (!phoneValidator(phone)) return res.status(400).send({res: 'Expected phone number of 10 digits', error: true});

    if (!NITValidator(NIT)) return res.status(400).send({res: 'We only accept numbers in NIT', error: true});

    const company = await Company.findOne({where: {NIT}});

    if (company) return res.status(409).send({res: 'Company with that NIT already exists', error: true});

    const newCompany = await Company.create({NIT, name, address, phone});

    return res.status(201).send({res: newCompany, error: false});

  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const editCompany = async (req: ICompanyRequest, res: Response) => {
  try {
    const { NIT, name, address, phone } = req.body;

    if (!NIT || !name || !address || !phone) {
      return res.status(400).send({res: 'Missing form fields!', error: true});
    }

    if (!phoneValidator(phone)) return res.status(400).send({res: 'Expected phone number of 10 digits', error: true});

    if (!NITValidator(NIT)) return res.status(400).send({res: 'We only accept numbers in NIT', error: true});

    const company = await Company.findOne({where: {NIT}});

    if (!company) return res.status(409).send({res: 'Company with that NIT does not exist', error: true});

    const editedCompany = await Company.update({NIT, name, address, phone}, {where: { NIT }, returning: true});

    return res.status(200).send({res: editedCompany[1][0], error: false});

  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const deleteCompany = async (req: ICompanyDeleteRequest, res: Response) => {
  try {
    const { NIT } = req.body;

    if (!NIT) {
      return res.status(400).send({res: 'Missing NIT!', error: true});
    }

    const company = await Company.findOne({where: {NIT}});

    if (!company) return res.status(409).send({res: 'Company with that NIT does not exist', error: true});

    await Company.destroy({where: {NIT}});

    return res.status(200).send({res: `Company with NIT: ${NIT} deleted from database`, error: false});

  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

export { createCompany, editCompany, deleteCompany };