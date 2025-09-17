import {
  dateAndHourErrorMsg,
  dateRegex, decimalRegex, hourRegex,
} from './DataRegex';

class InputsValidations {
  CheckIntegers(IntegersFieldsData) {
    if (IntegersFieldsData.quantity) {
      if (!Number.isInteger(IntegersFieldsData.quantity)) {
        return 'Quantity must be a integer';
      }
    }

    if (IntegersFieldsData.minimun_quantity) {
      if (!Number.isInteger(IntegersFieldsData.minimun_quantity)) {
        return 'Minimun_quantity must be a integer';
      }
    }
    return this.CheckDecimals(IntegersFieldsData);
  }

  CheckDecimals(DecimalsFieldsData) {
    if (DecimalsFieldsData.price) {
      if (!decimalRegex.test(DecimalsFieldsData.price)) {
        return 'Price must be a decimal positive type';
      }
    }

    if (DecimalsFieldsData.totalweight) {
      if (!decimalRegex.test(DecimalsFieldsData.totalweight)) {
        return 'Totalweight must be a decimal positive type';
      }
    }

    if (DecimalsFieldsData.weightperunit) {
      if (!decimalRegex.test(DecimalsFieldsData.weightperunit)) {
        return 'Weightperunit must be a decimal positive type';
      }
    }
    return this.CheckStrings(DecimalsFieldsData);
  }

  CheckStrings(StringsFieldsData) {
    if (StringsFieldsData.supplier) {
      if (typeof StringsFieldsData.supplier !== 'string') {
        return 'Supplier must be a string';
      }
    }
    return this.CheckDatesAndHour(StringsFieldsData);
  }

  CheckDatesAndHour(DatesFieldsData) {
    if (DatesFieldsData.entrydate) {
      if (!dateRegex.test(DatesFieldsData.entrydate)) {
        return dateAndHourErrorMsg;
      }
    }

    if (DatesFieldsData.expirationdate) {
      if (!dateRegex.test(DatesFieldsData.expirationdate)) {
        return dateAndHourErrorMsg;
      }
    }

    if (DatesFieldsData.entryhour) {
      if (!hourRegex.test(DatesFieldsData.entryhour)) {
        return dateAndHourErrorMsg;
      }
    }
    return null;
  }
}

export default new InputsValidations();
