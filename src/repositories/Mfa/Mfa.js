import Mfa from '../../models/MfaPhrase';

class MfaList {
  async Store(data) {
    const mfaDataRegister = await Mfa.create(data);
    return mfaDataRegister;
  }

  async Update(id, data) {
    const mfaDataUpdate = await Mfa.findByPk(id);

    if (!mfaDataUpdate) return 'código não encontrado';

    const newMfaData = await mfaDataUpdate.update(data);

    return newMfaData;
  }
}

export default new MfaList();
