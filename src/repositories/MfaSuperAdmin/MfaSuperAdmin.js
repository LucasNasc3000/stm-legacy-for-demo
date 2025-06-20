import MfaSuperAdmin from '../../models/MfaPhrase';

class MfaList {
  async Store(data) {
    const mfaDataRegister = await MfaSuperAdmin.create(data);
    return mfaDataRegister;
  }

  // eslint-disable-next-line consistent-return
  async Delete(id) {
    const mfaFndRegister = await MfaSuperAdmin.findByPk(id);

    if (!mfaFndRegister) return 'Registro não encontrado';

    await mfaFndRegister.destroy();
  }

  async Update(id, data) {
    const mfaDataUpdate = await MfaSuperAdmin.findByPk(id);

    if (!mfaDataUpdate) return 'código não encontrado';

    const newMfaData = await mfaDataUpdate.update(data);

    return newMfaData;
  }
}

export default new MfaList();
