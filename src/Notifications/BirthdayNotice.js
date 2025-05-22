/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
import { EmailErrors } from '../errors/emailsErrors';
import { Forbidden } from '../errors/forbidden';
import EmployeeSearchCredentials from '../repositories/Employee/EmployeeSearchCredentials';
import SecretsHandler from '../secretsHandler';

const sgMail = require('@sendgrid/mail');

const getSgApiKey = SecretsHandler('sgApiKey');

sgMail.setApiKey(getSgApiKey);

class BirthdaysNotifications {
  async AddressesAllowed() {
    const getSalesPermission = SecretsHandler('salesAccess');
    const getSOPermission = SecretsHandler('salesOutputsAccess');
    const getSOIPermission = SecretsHandler('salesOutputsInputsAccess');
    const getAdminPermission = SecretsHandler('admin');
    const employeeSearch = await EmployeeSearchCredentials.SearchByAddressAllowed();
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
    const getFromEmail1 = SecretsHandler('fromEmail1');

    if (destinataryVerify === null) throw new Forbidden('Não há funcionários com permissão para receber e-mails');

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
          throw new EmailErrors(error);
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
            throw new EmailErrors(error);
          });
      }
    }
  }
}

export default new BirthdaysNotifications();
