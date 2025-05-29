"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
var _emailsErrors = require('../errors/emailsErrors');
var _forbidden = require('../errors/forbidden');
var _EmployeeSearchCredentials = require('../repositories/Employee/EmployeeSearchCredentials'); var _EmployeeSearchCredentials2 = _interopRequireDefault(_EmployeeSearchCredentials);
var _secretsHandler = require('../secretsHandler'); var _secretsHandler2 = _interopRequireDefault(_secretsHandler);

const sgMail = require('@sendgrid/mail');

const getSgApiKey = _secretsHandler2.default.call(void 0, 'sgApiKey');

sgMail.setApiKey(getSgApiKey);

class BirthdaysNotifications {
  async AddressesAllowed() {
    const getSalesPermission = _secretsHandler2.default.call(void 0, 'salesAccess');
    const getSOPermission = _secretsHandler2.default.call(void 0, 'salesOutputsAccess');
    const getSOIPermission = _secretsHandler2.default.call(void 0, 'salesOutputsInputsAccess');
    const getAdminPermission = _secretsHandler2.default.call(void 0, 'admin');
    const employeeSearch = await _EmployeeSearchCredentials2.default.SearchByAddressAllowed();
    const addressesAllowed = [];
    let correctPermission = false;

    for (let i = 0; i < employeeSearch.length; i++) {
      if (employeeSearch[i].dataValues.permission === getSalesPermission
          || employeeSearch[i].dataValues.permission === getSOPermission
          || employeeSearch[i].dataValues.permission === getSOIPermission
          || employeeSearch[i].dataValues.permission === getAdminPermission
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

  async SendEmail(emailSubject, emailBody) {
    const destinataryVerify = await this.AddressesAllowed();
    const getFromEmail1 = _secretsHandler2.default.call(void 0, 'fromEmail1');

    if (destinataryVerify === null) throw new (0, _forbidden.Forbidden)('Não há funcionários com permissão para receber e-mails');

    if (destinataryVerify.length === 1) {
      const msg = {
        to: destinataryVerify[0],
        from: getFromEmail1,
        subject: emailSubject,
        text: emailBody,
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

    if (destinataryVerify.length > 1) {
      for (let i = 0; i < destinataryVerify.length; i++) {
        const msg = {
          to: destinataryVerify[i],
          from: getFromEmail1,
          subject: emailSubject,
          text: emailBody,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };

        sgMail
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
  }
}

exports. default = new BirthdaysNotifications();
