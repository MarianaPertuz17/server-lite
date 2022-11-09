import {
  Model,
  Optional,
  DataTypes,
} from 'sequelize';
import { sequelize } from './index';

interface IGuestAttributes {
  id: number;
  email: string;
  password: string;
}

interface IGuestCreationAttributes extends Optional<IGuestAttributes, 'id'> {}

export class Guest
  extends Model<IGuestAttributes, IGuestCreationAttributes>
  implements IGuestAttributes
{
  public id!: number;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

Guest.init(
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
    tableName: 'guests',
    sequelize,
  }
);
