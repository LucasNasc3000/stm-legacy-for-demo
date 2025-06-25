/* eslint-disable no-plusplus */
import { Forbidden } from '../errors/forbidden';
import EmployeeSearchCredentials from '../repositories/Employee/EmployeeSearchCredentials';
import SecretsHandler from '../secretsHandler';

const sgMail = require('@sendgrid/mail');

const getSgApiKey = SecretsHandler('sgApiKey');

sgMail.setApiKey(getSgApiKey);

class MfaSendEmail {
  async AddressesAllowed() {
    const getSuperAdminPermission = SecretsHandler('superAdmin');
    const employeeSearch = await EmployeeSearchCredentials.SearchByAddressAllowed();
    const addressesAllowed = [];
    let correctPermission = false;

    for (let i = 0; i < employeeSearch.length; i++) {
      if (employeeSearch[i].dataValues.permission === getSuperAdminPermission) {
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
    const fromEmail1 = SecretsHandler('fromEmail1');
    const destinataryVerify = await this.AddressesAllowed();

    if (destinataryVerify === null) throw new Forbidden('Não há funcionários com permissão para receber e-mails');

    const msg = {
      to: destinataryVerify[0],
      from: fromEmail1,
      subject: 'Código de acesso',
      text: AccessCode,
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    sgMail
      .send(msg);
    // .then((response) => {
    //   console.log(response[0].statusCode);
    //   console.log(response[0].headers);
    //   return 'Notificacao enviada';
    // })
    // .catch((error) => {
    //   throw new EmailErrors(error);
    // });

    return 'Codigo enviado';
  }
}

export default new MfaSendEmail();
