import MfaSuperAdmin from '../../models/MfaSuperAdmin';

class MfaList {
  async Store(data) {
    const mfaDataRegister = await MfaSuperAdmin.create(data);
    return mfaDataRegister;
  }
}

export default new MfaList();
