import { Injectable } from '@angular/core';
import { NO_LATIN_REGEX } from 'shared/constants/regex-constants';
import { ImportEmployeesChosenRole } from 'shared/enum/enumUA/import-export';
import { FieldValidationConfig, FieldsConfig } from 'shared/models/admin-import-export.model';

@Injectable({
  providedIn: 'root'
})
export class ImportValidationService {
  constructor() {}
  public checkForInvalidData(items: any[], config: FieldsConfig[]): void {
    items.forEach((item) => {
      this.findDuplicates(items, item);
      item.errors = {};
      config.forEach((field) => {
        this.validateField(field.fieldName, item, items, field.validationParam);
      });
    });
  }

  public findDuplicates(items: any[], item: unknown): boolean {
    const rnokppList = items.map(({ employeeRNOKPP }) => employeeRNOKPP);
    const result = rnokppList.filter((e) => e === item);
    return result.length > 1;
  }

  private validateField(fieldName: string, item: any, items: any, config: FieldValidationConfig): void {
    if (config.checkEmpty && !item[fieldName]) {
      item.errors[`${fieldName}Empty`] = true;
    } else if (config.checkLength && (item[fieldName].length <= 2 || item[fieldName].length > 50)) {
      item.errors[`${fieldName}Length`] = true;
    } else if (config.checkLanguage && !NO_LATIN_REGEX.test(item[fieldName])) {
      item.errors[`${fieldName}Language`] = true;
    } else if (config.checkDuplicate && this.findDuplicates(items, item[fieldName])) {
      item.errors[`${fieldName}Duplicate`] = true;
    } else if (
      config.checkAssignedRole &&
      item[fieldName] !== ImportEmployeesChosenRole.employee &&
      item[fieldName] !== ImportEmployeesChosenRole.deputyDirector
    ) {
      item.errors[`${fieldName}Format`] = true;
    }
  }
}
