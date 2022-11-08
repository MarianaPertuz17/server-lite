import {
  Model,
  Optional,
  DataTypes,
} from 'sequelize';
import { sequelize } from './index';

interface IUserAttributes {
  id: number;
  firstName: string;
  surname: string;
  username: string;
  password: string;
}

interface IUserCreationAttributes extends Optional<IUserAttributes, 'id'> {}

export class User
  extends Model<IUserAttributes, IUserCreationAttributes>
  implements IUserAttributes
{
  public id!: number;
  public firstName!: string;
  public surname!: string;
  public username!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    surname: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize,
  }
);
