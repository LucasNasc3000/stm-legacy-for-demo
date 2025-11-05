/* eslint-disable global-require */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
import { Forbidden } from '../errors/forbidden';
import EmployeeSearchCredentials from '../repositories/Employee/EmployeeSearchCredentials';

// const sgMail = require('@sendgrid/mail');

// const getSgApiKey = SecretsHandler('sgApiKey');

class RegistersNotifications {
  constructor() {
    this.nodemailer = require('nodemailer');
  }

  async AddressesAllowed() {
    // const getInputsOutputsPermission = SecretsHandler('inputsOutputsAccess');
    // const getSOIPermission = SecretsHandler('salesOutputsInputsAccess');
    // const getAdminPermission = SecretsHandler('admin');
    const employeeSearch = await EmployeeSearchCredentials.SearchByAddressAllowed();
    const addressesAllowed = [];
    let correctPermission = false;

    for (let i = 0; i < employeeSearch.length; i++) {
      if (employeeSearch[i].dataValues.permission === process.env.INPUTS_OUTPUTS_PERMISSION
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

  async SendEmail(emailSubject, emailBody, destinatary) {
    // const fromEmail1 = SecretsHandler('fromEmail1');
    const destinataryVerify = await this.AddressesAllowed();

    if (destinataryVerify === null) throw new Forbidden('Não há funcionários com permissão para receber e-mails');

    const transporter = this.Transporter();

    if (destinatary.length === 1) {
      const msg = {
        to: destinatary[0],
        from: process.env.FROM_EMAIL_2,
        subject: emailSubject,
        text: emailBody,
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };

      return transporter.sendMail(msg, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email enviado: ', info.response);
        }
      });
    }

    if (destinatary.length > 1) {
      for (let i = 0; i < destinatary.length; i++) {
        const msg = {
          to: destinatary[i],
          from: process.env.FROM_EMAIL_2,
          subject: emailSubject,
          text: emailBody,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };

        transporter.sendMail(msg, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email enviado: ', info.response);
          }
        });
      }
    }
  }
}

export default new RegistersNotifications();
