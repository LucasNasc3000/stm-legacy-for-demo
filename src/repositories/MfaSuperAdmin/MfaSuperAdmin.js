import MfaSuperAdmin from '../../models/MfaPhrase';

class MfaList {
  async Store(data) {
    const mfaDataRegister = await MfaSuperAdmin.create(data);
    return mfaDataRegister;
  }

  async Delete(id) {
    const mfaDataDelete = await MfaSuperAdmin.destroy({
      where: {
        id,
      },
    });

    if (!mfaDataDelete) return 'Algo deu errado';

    return mfaDataDelete;
  }
}

export default new MfaList();
