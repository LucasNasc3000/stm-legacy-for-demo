import Mfa from '../../models/MfaPhrase';

class SearchMfaData {
  async SearchById(id) {
    const findById = await Mfa.findOne({
      where: {
        id,
      },
    });

    return findById;
  }

  async SearchByEmail(email) {
    const findByEmail = await Mfa.findOne({
      where: {
        email,
      },
    });

    return findByEmail;
  }

  // eslint-disable-next-line consistent-return
  async SearchByPhrase(phrase) {
    try {
      const findByPhrase = await Mfa.findOne({
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
