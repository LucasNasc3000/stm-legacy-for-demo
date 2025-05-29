"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
var _emailsErrors = require('../errors/emailsErrors');
var _forbidden = require('../errors/forbidden');
var _EmployeeSearchCredentials = require('../repositories/Employee/EmployeeSearchCredentials'); var _EmployeeSearchCredentials2 = _interopRequireDefault(_EmployeeSearchCredentials);
var _secretsHandler = require('../secretsHandler'); var _secretsHandler2 = _interopRequireDefault(_secretsHandler);

const sgMail = require('@sendgrid/mail');

const getSgApiKey = _secretsHandler2.default.call(void 0, 'sgApiKey');

sgMail.setApiKey(getSgApiKey);

class RegistersNotifications {
  async AddressesAllowed() {
    const getInputsOutputsPermission = _secretsHandler2.default.call(void 0, 'inputsOutputsAccess');
    const getSOIPermission = _secretsHandler2.default.call(void 0, 'salesOutputsInputsAccess');
    const getAdminPermission = _secretsHandler2.default.call(void 0, 'admin');
    const employeeSearch = await _EmployeeSearchCredentials2.default.SearchByAddressAllowed();
    const addressesAllowed = [];
    let correctPermission = false;

    for (let i = 0; i < employeeSearch.length; i++) {
      if (employeeSearch[i].dataValues.permission === getInputsOutputsPermission
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

  async DataFilter(inputData, emailSubject, logError = '') {
    const destinatary = await this.AddressesAllowed();
    const subjects = ['Insumo chegando à quantidade limite', 'Insumo chegou à quantidade limite', 'Erro ao registrar log'];
    const emailBodies = [
      `Atenção:\nO insumo ${inputData[2]} está perto da quantidade limite de ${inputData[1]}.\nQuantidade atual: ${inputData[4]}`,
      `Atenção:\nO insumo ${inputData[2]} chegou à quantidade limite de ${inputData[1]}.`,
      `Ocorreu o seguinte erro ao registrar um log: \n${logError}`,
    ];

    if (destinatary === null) return 'no destinataries';

    // eslint-disable-next-line default-case
    switch (emailSubject) {
      case 'rateIsNear':
        this.SendEmail(subjects[0], emailBodies[0], destinatary);
        break;

      case 'limitReached':
        this.SendEmail(subjects[1], emailBodies[1], destinatary);
        break;

      case 'logError':
        this.SendEmail(subjects[2], emailBodies[2], destinatary);
        break;
    }
  }

  async SendEmail(emailSubject, emailBody, destinatary) {
    const fromEmail1 = _secretsHandler2.default.call(void 0, 'fromEmail1');
    const destinataryVerify = await this.AddressesAllowed();

    if (destinataryVerify === null) throw new (0, _forbidden.Forbidden)('Não há funcionários com permissão para receber e-mails');

    if (destinatary.length === 1) {
      const msg = {
        to: destinatary[0],
        from: fromEmail1,
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

    if (destinatary.length > 1) {
      for (let i = 0; i < destinatary.length; i++) {
        const msg = {
          to: destinatary[i],
          from: fromEmail1,
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

exports. default = new RegistersNotifications();
