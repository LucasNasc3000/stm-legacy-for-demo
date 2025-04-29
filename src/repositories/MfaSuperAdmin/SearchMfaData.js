import MfaSuperAdmin from '../../models/MfaPhrase';

class SearchMfaData {
  async SearchById(id) {
    const findById = await MfaSuperAdmin.findOne({
      where: {
        id,
      },
    });

    return findById;
  }

  async SearchByEmail(email) {
    const findByEmail = await MfaSuperAdmin.findOne({
      where: {
        email,
      },
    });

    return findByEmail;
  }

  // eslint-disable-next-line consistent-return
  async SearchByPhrase(phrase) {
    try {
      const findByPhrase = await MfaSuperAdmin.findOne({
        where: {
          phrase,
        },
      });
      console.log(findByPhrase);

      return findByPhrase;
    } catch (e) {
      console.log(e);
    }
  }
}

export default new SearchMfaData();
