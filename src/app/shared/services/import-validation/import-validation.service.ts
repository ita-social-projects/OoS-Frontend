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
    return rnokppList.filter((e) => e === item).length > 1;
  }

  private validateField(fieldName: string, item: any, items: any, config: FieldValidationConfig): void {
    const fieldValue = item[fieldName];
    if (config.checkEmpty && !fieldValue) {
      item.errors[`${fieldName}Empty`] = true;
      return;
    }

    const validators = [
      {
        condition: config.checkLength && (fieldValue.length <= 2 || fieldValue.length > 50),
        errorKey: `${fieldName}Length`
      },
      { condition: config.checkLanguage && !NO_LATIN_REGEX.test(fieldValue), errorKey: `${fieldName}Language` },
      { condition: config.checkDuplicate && this.findDuplicates(items, fieldValue), errorKey: `${fieldName}Duplicate` },
      {
        condition:
          config.checkAssignedRole && ![ImportEmployeesChosenRole.employee, ImportEmployeesChosenRole.deputyDirector].includes(fieldValue),
        errorKey: `${fieldName}Format`
      }
    ];

    validators.forEach(({ condition, errorKey }) => {
      if (condition) {
        item.errors[errorKey] = true;
      }
    });
  }
}
