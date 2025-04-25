/* eslint-disable no-plusplus */
import { EmailErrors } from '../errors/emailsErrors';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class MfaSuperAdminSendEmail {
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
