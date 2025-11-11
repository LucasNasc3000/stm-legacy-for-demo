/* eslint-disable global-require */
/* eslint-disable no-plusplus */
import { Forbidden } from '../errors/forbidden';

// const sgMail = require('@sendgrid/mail');

// const getSgApiKey = SecretsHandler('sgApiKey');

// sgMail.setApiKey(getSgApiKey);

class MfaSendEmail {
  constructor() {
    this.nodemailer = require('nodemailer');
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

  async SendEmail(AccessCode, email) {
    // const fromEmail1 = SecretsHandler('fromEmail1');

    if (!email) throw new Forbidden('Destinatário não informado');

    const transporter = this.Transporter();

    const msg = {
      to: email,
      from: process.env.FROM_EMAIL_2,
      subject: 'Código de acesso',
      text: AccessCode,
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    const send = await transporter.sendMail(msg);

    if (!send) return 'Algo deu errado';

    return 'Código enviado';
  }
}

export default new MfaSendEmail();
