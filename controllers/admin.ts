import { Request, Response } from 'express';
import { Company } from '../models/company';
import { Product } from '../models/product';
import { NITValidator, phoneValidator } from '../utils';

interface ICompanyBody {
  NIT: string;
  name: string;
  address: string;
  phone: string;
}

interface IProductBody {
  companyId: string;
  productName: string;
  quantity: number;
}

interface ICompanyRequest extends Request {
  body: ICompanyBody;
}

interface IProductRequest extends Request {
  body: IProductBody;
}

interface ICompanyDeleteRequest extends Request {
  params: {
    companyId: string;
  };
}

interface IProductDeleteRequest extends Request {
  params: {
    productId: string;
  };
}


const createCompany = async (req: ICompanyRequest, res: Response) => {
  try {
    const { NIT, name, address, phone } = req.body;
    console.log(req.body, 'create company');
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
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).send({res: 'Missing NIT!', error: true});
    }

    const company = await Company.findOne({where: {NIT: companyId}});

    if (!company) return res.status(409).send({res: 'Company with that NIT does not exist', error: true});

    await Company.destroy({where: {NIT: companyId}});

    return res.status(200).send({res: `Company with NIT: ${companyId} deleted from database`, error: false});

  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const createProduct = async (req: IProductRequest, res: Response) => {
  try {
    const { companyId, productName, quantity } = req.body;

    if (!companyId || !productName || quantity === undefined) {
      return res.status(400).send({res: 'Missing form fields!', error: true});
    }

    if (quantity < 0) return res.status(400).send({res: 'Product quantity has to be greater than or equal to zero', error: true});

    if (!NITValidator(companyId)) return res.status(400).send({res: 'We only accept numbers in NIT', error: true});

    const company = await Company.findOne({where: {NIT: companyId}});

    if (!company) return res.status(400).send({res: 'Company with that NIT does not exist', error: true});

    const product = await Product.findOne({where: { companyId, productName: productName.toLowerCase().trim()}});

    if (product) return res.status(409).send({res: 'Product already exists for that company', error: true});

    const newProduct = await Product.create({companyId, productName: productName.toLowerCase().trim(), quantity});

    return res.status(201).send({res: newProduct, error: false});

  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};

const deleteProduct = async (req: IProductDeleteRequest, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).send({res: 'Missing product id!', error: true});
    }

    const product = await Product.findOne({where: {id: productId}});

    if (!product) return res.status(409).send({res: 'Company with that product id does not exist', error: true});

    await Product.destroy({where: {id: productId}});

    return res.status(200).send({res: `Product with product id: ${productId} deleted from database`, error: false});

  } catch (e) {
    console.log(e); // tslint:disable-line
    res.status(500).send({ res: 'Internal Server Error!', error: true });
  }
};


export { createCompany, editCompany, deleteCompany, createProduct, deleteProduct };