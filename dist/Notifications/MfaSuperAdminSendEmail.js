"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable no-plusplus */
var _emailsErrors = require('../errors/emailsErrors');
var _forbidden = require('../errors/forbidden');
var _EmployeeSearchCredentials = require('../repositories/Employee/EmployeeSearchCredentials'); var _EmployeeSearchCredentials2 = _interopRequireDefault(_EmployeeSearchCredentials);
var _secretsHandler = require('../secretsHandler'); var _secretsHandler2 = _interopRequireDefault(_secretsHandler);

const sgMail = require('@sendgrid/mail');

const getSgApiKey = _secretsHandler2.default.call(void 0, 'sgApiKey');

sgMail.setApiKey(getSgApiKey);

class MfaSendEmail {
  async AddressesAllowed() {
    const getAdminPermission = _secretsHandler2.default.call(void 0, 'admin');
    const getInputsPermission = _secretsHandler2.default.call(void 0, 'inputsAccess');
    const getOutputsPermission = _secretsHandler2.default.call(void 0, 'outputsAccess');
    const getSalesPermission = _secretsHandler2.default.call(void 0, 'salesAccess');
    const getSalesOutputsPermission = _secretsHandler2.default.call(void 0, 'salesOutputsAccess');
    const getInputsOutputsPermission = _secretsHandler2.default.call(void 0, 'inputsOutputsAccess');
    const getSalesOutputsInputsPermission = _secretsHandler2.default.call(void 0, 'salesOutputsInputsAccess');
    const getSuperAdminPermission = _secretsHandler2.default.call(void 0, 'superAdmin');
    const employeeSearch = await _EmployeeSearchCredentials2.default.SearchByAddressAllowed();
    const addressesAllowed = [];
    let correctPermission = false;

    for (let i = 0; i < employeeSearch.length; i++) {
      if (employeeSearch[i].dataValues.permission === getAdminPermission
          || employeeSearch[i].dataValues.permission === getSuperAdminPermission
          || employeeSearch[i].dataValues.permission === getInputsPermission
          || employeeSearch[i].dataValues.permission === getOutputsPermission
          || employeeSearch[i].dataValues.permission === getSalesPermission
          || employeeSearch[i].dataValues.permission === getInputsOutputsPermission
          || employeeSearch[i].dataValues.permission === getSalesOutputsPermission
          || employeeSearch[i].dataValues.permission === getSalesOutputsInputsPermission
      ) {
        addressesAllowed.push(employeeSearch[i].dataValues.email);
        correctPermission = true;
      }
    }

    if (employeeSearch && correctPermission === true) {
      return addressesAllowed;
    }

    return null;
  }

  async SendEmail(AccessCode) {
    const fromEmail1 = _secretsHandler2.default.call(void 0, 'fromEmail1');
    const destinataryVerify = await this.AddressesAllowed();

    if (destinataryVerify === null) throw new (0, _forbidden.Forbidden)('Não há funcionários com permissão para receber e-mails');

    const msg = {
      to: destinataryVerify[0],
      from: fromEmail1,
      subject: 'Código de acesso',
      text: AccessCode,
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    return sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
        return 'Notificacao enviada';
      })
      .catch((error) => {
        throw new (0, _emailsErrors.EmailErrors)(error);
      });
  }
}

exports. default = new MfaSendEmail();
