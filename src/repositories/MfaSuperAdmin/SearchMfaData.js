import MfaSuperAdmin from '../../models/MfaSuperAdmin';

class SearchMfaData {
  async SearchByEmail(email) {
    const findByEmail = await MfaSuperAdmin.findOne({
      where: {
        email,
      },
    });

    return findByEmail;
  }

  async SearchByPhrase(phrase) {
    const findByPhrase = await MfaSuperAdmin.findOne({
      where: {
        phrase,
      },
    });

    return findByPhrase;
  }
}

export default new SearchMfaData();
