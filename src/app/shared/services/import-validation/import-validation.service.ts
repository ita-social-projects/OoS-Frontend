import { Injectable } from '@angular/core';
import { NO_LATIN_REGEX, RNOKPP_REGEX } from 'shared/constants/regex-constants';
import { ImportEmployeesChosenRole } from 'shared/enum/enumUA/import-export';
import { FieldValidationConfig, FieldsConfig } from 'shared/models/admin-import-export.model';

@Injectable({
  providedIn: 'root'
})
export class ImportValidationService {
  constructor() {}
  public checkForInvalidData(items: any[], config: FieldsConfig[]): void {
    items.forEach((item) => {
      item.errors = {};
      config.forEach((field) => {
        this.validateField(field.fieldName, item, field.validationParam);
      });
    });
  }

  private validateField(fieldName: string, item: any, config: FieldValidationConfig): void {
    if (config.checkEmpty && !item[fieldName]) {
      item.errors[`${fieldName}Empty`] = true;
    } else if (config.checkLength && (item[fieldName].length <= 2 || item[fieldName].length > 50)) {
      item.errors[`${fieldName}Length`] = true;
    } else if (config.checkLanguage && !NO_LATIN_REGEX.test(item[fieldName])) {
      item.errors[`${fieldName}Language`] = true;
    } else if (config.checkRNOKPP && !RNOKPP_REGEX.test(item[fieldName].toString())) {
      item.errors[`${fieldName}Format`] = true;
    } else if (
      config.checkAssignedRole &&
      item[fieldName] !== ImportEmployeesChosenRole.employee &&
      item[fieldName] !== ImportEmployeesChosenRole.deputyDirector
    ) {
      item.errors[`${fieldName}Format`] = true;
    }
  }
}
