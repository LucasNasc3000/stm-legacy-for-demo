"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// eslint-disable-next-line import/no-extraneous-dependencies
var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

 class Mfaphrase extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      id: {
        type: _sequelize2.default.DataTypes.UUIDV1,
        defaultValue: _sequelize2.default.DataTypes.UUIDV1,
        primaryKey: true,
        allowNull: false,
      },
      phrase: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [1, 255],
            msg: 'A frase deve ter no máximo 255 caracteres',
          },
        },
      },
      sequence_hash: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [1, 255],
            msg: 'O código deve ter no máximo 255 caracteres',
          },
        },
      },
      email: {
        type: _sequelize2.default.STRING,
        defaultValue: '',
        validate: {
          isEmail: {
            args: [13, 255],
            msg: 'Email inválido',
          },
        },
      },
      is_valid: {
        type: _sequelize2.default.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, {
      sequelize,
    });
    return this;
  }
} exports.default = Mfaphrase;
