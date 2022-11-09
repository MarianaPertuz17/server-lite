import {
  Model,
  Optional,
  DataTypes,
} from 'sequelize';
import { sequelize } from './index';

interface IAdminAttributes {
  id: number;
  email: string;
  password: string;
}

interface IAdminCreationAttributes extends Optional<IAdminAttributes, 'id'> {}

export class Admin
  extends Model<IAdminAttributes, IAdminCreationAttributes>
  implements IAdminAttributes
{
  public id!: number;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    }
  },
  {
    tableName: 'admins',
    sequelize,
  }
);
