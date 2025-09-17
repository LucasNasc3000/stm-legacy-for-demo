// eslint-disable-next-line import/prefer-default-export
export const ReplaceDot = (data) => {
  const toFindDotFields = data.map((element) => element.dataValues);

  // eslint-disable-next-line array-callback-return
  toFindDotFields.map((element) => {
    if (element !== 'created_at' && element !== 'updated_at') {
      element.price = element.price.replace('.', ',');
    }
  });

  return toFindDotFields;
};

export const InsertDot = (data) => {
  const commaFields = [
    'totalweight',
    'weightperunit',
    'price',
  ];

  commaFields.forEach((element) => {
    if (data[element]) data[element] = data[element].replace(',', '.');
  });

  return data;
};
