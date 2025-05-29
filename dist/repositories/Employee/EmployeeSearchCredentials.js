"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize');
var _Employee = require('../../models/Employee'); var _Employee2 = _interopRequireDefault(_Employee);
var _secretsHandler = require('../../secretsHandler'); var _secretsHandler2 = _interopRequireDefault(_secretsHandler);
var _Attributes = require('./Attributes'); var _Attributes2 = _interopRequireDefault(_Attributes);

class EmployeesSearchCredentials {
  async SearchById(id) {
    const employeeFinder = await _Employee2.default.findOne({
      where: {
        id,
      },
      attributes: _Attributes2.default,
    });

    return employeeFinder;
  }

  async SearchByName(name) {
    const employeeFinderByName = await _Employee2.default.findAll({
      where: {
        name: { [_sequelize.Op.startsWith]: name },
      },
      attributes: _Attributes2.default,
      order: [['id', 'DESC']],
    });

    return employeeFinderByName;
  }

  async SearchOneByName(name) {
    const employeeFinderByName = await _Employee2.default.findOne({
      where: {
        name,
      },
      attributes: _Attributes2.default,
    });

    return employeeFinderByName;
  }

  async SearchByEmail(email) {
    const employeeFinderByEmail = await _Employee2.default.findOne({
      where: {
        email,
      },
      attributes: _Attributes2.default,
    });

    return employeeFinderByEmail;
  }

  async SearchByAddressAllowed() {
    const addressAllowed = _secretsHandler2.default.call(void 0, 'addressAllowed');
    const employeeFinderByAddressAllowed = await _Employee2.default.findAll({
      where: {
        address_allowed: addressAllowed,
        is_active: 1,
      },
      attributes: _Attributes2.default,
    });

    return employeeFinderByAddressAllowed;
  }

  async SearchByForActives() {
    const employeeFinderActives = await _Employee2.default.findAll({
      where: {
        is_active: 1,
      },
      attributes: _Attributes2.default,
    });

    return employeeFinderActives;
  }
}

exports. default = new EmployeesSearchCredentials();
