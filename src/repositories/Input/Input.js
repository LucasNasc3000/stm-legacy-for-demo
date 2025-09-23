import Input from '../../models/Input';

class InputsList {
  async Update(id, data) {
    const input = await Input.findByPk(id);

    if (!input) return 'Insumo não encontrado';

    const newInputData = await input.update(data);

    return newInputData;
  }
}

export default new InputsList();
