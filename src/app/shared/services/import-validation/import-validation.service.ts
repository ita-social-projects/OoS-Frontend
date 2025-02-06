import { Injectable } from '@angular/core';
import { NO_LATIN_REGEX } from 'shared/constants/regex-constants';
import { ImportEmployeesChosenRole } from 'shared/enum/enumUA/import-export';
import { Employee, FieldValidationConfig, FieldsConfig, ValidationError } from 'shared/models/admin-import-export.model';

@Injectable({
  providedIn: 'root'
})
export class ImportValidationService<ChildInterface extends { errors: ValidationError }> {
  constructor() {}
  public checkForInvalidData(items: ChildInterface[], config: FieldsConfig[]): void {
    items.forEach((item) => {
      item.errors = {};
      config.forEach((field) => {
        this.validateField(field.fieldName, item, items, field.validationParam);
      });
    });
  }

  public findDuplicates<T extends ChildInterface & { employeeRNOKPP?: number }>(items: T[], item: number): boolean {
    return items.map((rnokpp) => rnokpp.employeeRNOKPP ?? null).filter((e) => e === item).length > 1;
  }

  private validateField(fieldName: string, item: ChildInterface, items: ChildInterface[], config: FieldValidationConfig): void {
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
