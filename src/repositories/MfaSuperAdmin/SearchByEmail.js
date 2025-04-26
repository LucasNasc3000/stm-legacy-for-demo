import MfaSuperAdmin from '../../models/MfaSuperAdmin';

class SearchByEmail {
  async Search(email) {
    const find = await MfaSuperAdmin.findOne({
      where: {
        email,
      },
    });

    return find;
  }
}

export default new SearchByEmail();
