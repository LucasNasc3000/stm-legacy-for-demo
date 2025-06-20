import MfaSuperAdmin from '../../models/MfaPhrase';

class MfaList {
  async Store(data) {
    const mfaDataRegister = await MfaSuperAdmin.create(data);
    return mfaDataRegister;
  }

  async Delete(id) {
    const mfaDeleteRegister = await MfaSuperAdmin.destroy(id);
    return mfaDeleteRegister;
  }

  async Update(id, data) {
    const mfaDataUpdate = await MfaSuperAdmin.findByPk(id);

    if (!mfaDataUpdate) return 'código não encontrado';

    const newMfaData = await mfaDataUpdate.update(data);

    return newMfaData;
  }
}

export default new MfaList();
