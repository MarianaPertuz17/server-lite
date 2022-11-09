import {
  Model,
  Optional,
  DataTypes,
} from 'sequelize';
import { Product } from './product';
import { sequelize } from './index';

interface ICompanyAttributes {
  NIT: string;
  name: string;
  address: string;
  phone: string;
}

interface ICompanyCreationAttributes extends Optional<ICompanyAttributes, 'NIT'> {}

export class Company
  extends Model<ICompanyAttributes, ICompanyCreationAttributes>
  implements ICompanyAttributes
{
  public NIT!: string;
  public name!: string;
  public address!: string;
  public phone!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

Company.init(
  {
    NIT: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    address: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    phone: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    }
  },
  {
    tableName: 'companies',
    sequelize,
  }
);

Company.hasMany(Product, {
  sourceKey: 'NIT',
  foreignKey: 'companyId',
  as: 'products'
});

Product.belongsTo(Company, {foreignKey: 'companyId'});

