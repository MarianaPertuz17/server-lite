import {
  Model,
  Optional,
  DataTypes,
} from 'sequelize';
import { sequelize } from './index';

interface IProductAttributes {
  id: number;
  companyId: string;
  productName: string;
  quantity: number;
}

interface IProductCreationAttributes extends Optional<IProductAttributes, 'id'> {}

export class Product
  extends Model<IProductAttributes, IProductCreationAttributes>
  implements IProductAttributes
{
  public id!: number;
  public companyId!: string;
  public productName!: string;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'products',
    sequelize,
  }
);
