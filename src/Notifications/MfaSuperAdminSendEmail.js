/* eslint-disable global-require */
/* eslint-disable no-plusplus */
import { Forbidden } from '../errors/forbidden';
import EmployeeSearchCredentials from '../repositories/Employee/EmployeeSearchCredentials';

// const sgMail = require('@sendgrid/mail');

// const getSgApiKey = SecretsHandler('sgApiKey');

// sgMail.setApiKey(getSgApiKey);

class MfaSendEmail {
  constructor() {
    this.nodemailer = require('nodemailer');
  }

  async AddressesAllowed() {
    // const getSuperAdminPermission = SecretsHandler('superAdmin');
    const employeeSearch = await EmployeeSearchCredentials.SearchByAddressAllowed();
    const addressesAllowed = [];
    let correctPermission = false;

    for (let i = 0; i < employeeSearch.length; i++) {
      if (employeeSearch[i].dataValues.permission === process.env.ADMIN_PERMISSION) {
        addressesAllowed.push(employeeSearch[i].dataValues.email);
        correctPermission = true;
      }
    }

    if (employeeSearch && correctPermission === true) {
      return addressesAllowed;
    }

    return null;
  }

  Transporter() {
    return this.nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: false,
      auth: {
        user: process.env.FROM_EMAIL_2,
        pass: process.env.APP_PASS,
      },
    });
  }

  async SendEmail(AccessCode) {
    // const fromEmail1 = SecretsHandler('fromEmail1');
    const destinataryVerify = await this.AddressesAllowed();

    if (destinataryVerify === null) throw new Forbidden('Não há funcionários com permissão para receber e-mails');

    const transporter = this.Transporter();

    const msg = {
      to: destinataryVerify[0],
      from: process.env.FROM_EMAIL_2,
      subject: 'Código de acesso',
      text: AccessCode,
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    return transporter.sendMail(msg, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Código enviado: ', info.response);
      }
    });
  }
}

export default new MfaSendEmail();
