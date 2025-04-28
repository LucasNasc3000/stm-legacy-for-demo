/* eslint-disable no-plusplus */
import { EmailErrors } from '../errors/emailsErrors';
import EmployeeSearchCredentials from '../repositories/Employee/EmployeeSearchCredentials';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class MfaSuperAdminSendEmail {
  async AddressesAllowed() {
    const employeeSearch = await EmployeeSearchCredentials.SearchByAddressAllowed();
    const addressesAllowed = [];
    let correctPermission = false;

    for (let i = 0; i < employeeSearch.length; i++) {
      if (employeeSearch[i].dataValues.permission === process.env.SALES_PERMISSION
          || employeeSearch[i].dataValues.permission === process.env.SO_PERMISSION
          || employeeSearch[i].dataValues.permission === process.env.SOI_PERMISSION
          || employeeSearch[i].dataValues.permission === process.env.ADMIN_PERMISSION
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
    const destinataryVerify = await this.AddressesAllowed();

    if (destinataryVerify === null) return null;

    const msg = {
      to: destinataryVerify[0],
      from: process.env.FROM_EMAIL,
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
        throw new EmailErrors(error);
      });
  }
}

export default new MfaSuperAdminSendEmail();
