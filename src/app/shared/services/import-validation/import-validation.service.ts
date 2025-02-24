import { Injectable } from '@angular/core';
import { NAME_REGEX, NO_LATIN_REGEX, RNOKPP_drfocode } from 'shared/constants/regex-constants';
import { ImportEmployeesChosenRole } from 'shared/enum/enumUA/import-export';
import { FieldValidationConfig, FieldsConfig, ValidationError } from 'shared/models/admin-import-export.model';

@Injectable({
  providedIn: 'root'
})
export class ImportValidationService<DataSource extends { errors: ValidationError }> {
  constructor() {}
  public checkForInvalidData(items: DataSource[], config: FieldsConfig[]): void {
    items.forEach((item) => {
      item.errors = {};
      config.forEach((field) => {
        this.validateField(field.fieldName, item, items, field.validationParam);
      });
    });
  }

  public findDuplicates<T extends DataSource & { employeeRNOKPP?: number }>(items: T[], item: number): boolean {
    return items.map((rnokpp) => rnokpp.employeeRNOKPP ?? null).filter((e) => e === item).length > 1;
  }

  private validateField(fieldName: string, item: DataSource, items: DataSource[], config: FieldValidationConfig): void {
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
      },
      {
        condition: config.checkInitials && !NAME_REGEX.test(fieldValue),
        errorKey: `${fieldName}Format`
      },
      {
        condition: config.checkRNOKPP && !RNOKPP_drfocode.test(fieldValue),
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
