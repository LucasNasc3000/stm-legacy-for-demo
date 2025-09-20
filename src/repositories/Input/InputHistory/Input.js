import Input from '../../../models/InputHistory';

class InputsList {
  async Store(data) {
    const newInput = await Input.create(data);
    return newInput;
  }
}

export default new InputsList();
