// eslint-disable-next-line import/no-extraneous-dependencies
import Sequelize, { Model } from 'sequelize';

export default class Mfaphrase extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: Sequelize.DataTypes.UUIDV1,
        defaultValue: Sequelize.DataTypes.UUIDV1,
        primaryKey: true,
        allowNull: false,
      },
      phrase: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [1, 255],
            msg: 'A frase deve ter no máximo 255 caracteres',
          },
        },
      },
      sequence_hash: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [1, 255],
            msg: 'O código deve ter no máximo 255 caracteres',
          },
        },
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: '',
        unique: {
          msg: 'Email já existente',
        },
        validate: {
          isEmail: {
            args: [13, 255],
            msg: 'Email inválido',
          },
        },
      },
    }, {
      sequelize,
    });
    return this;
  }
}
