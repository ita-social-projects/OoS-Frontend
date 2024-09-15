/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { NO_LATIN_REGEX, RNOKPP_REGEX } from 'shared/constants/regex-constants';
import { ImportEmployeesChosenRole } from 'shared/enum/enumUA/import-export';

@Injectable({
  providedIn: 'root'
})
export class ImportValidationService {
  constructor() {}
  public checkForInvalidData(items: any[]): void {
    items.forEach((elem) => {
      elem.errors = {};
      this.validateEmployeeName(elem);
      this.validateEmployeeSurname(elem);
      this.validateEmployeeFatherName(elem);
      this.validateEmployeeRNOKPP(elem);
      this.validateEmployeeAssignedRole(elem);
    });
  }

  public validateEmployeeName(elem: any): void {
    this.validateField('employeeName', elem);
  }

  public validateEmployeeSurname(elem: any): void {
    this.validateField('employeeSurname', elem);
  }

  public validateEmployeeFatherName(elem: any): void {
    this.validateField('employeeFatherName', elem);
  }

  // public validateEmployeeName(elem: any): void {
  //   if (!elem.employeeName) {
  //     elem.errors.employeeNameEmpty = true;
  //   } else if (elem.employeeName.length <= 2 || elem.employeeName.length > 50) {
  //     elem.errors.employeeNameLength = true;
  //   } else if (!NO_LATIN_REGEX.test(elem.employeeName)) {
  //     elem.errors.employeeNameLanguage = true;
  //   }
  // }

  // public validateEmployeeSurname(elem: any): void {
  //   if (!elem.employeeSurname) {
  //     elem.errors.employeeSurnameEmpty = true;
  //   } else if (elem.employeeSurname.length <= 2 || elem.employeeSurname.length > 50) {
  //     elem.errors.employeeSurnameLength = true;
  //   } else if (!NO_LATIN_REGEX.test(elem.employeeSurname)) {
  //     elem.errors.employeeSurnameLanguage = true;
  //   }
  // }

  // public validateEmployeeFatherName(elem: any): void {
  //   if (!elem.employeeFatherName) {
  //     elem.errors.employeeFatherNameEmpty = true;
  //   } else if (elem.employeeFatherName.length <= 2 || elem.employeeFatherName.length > 50) {
  //     elem.errors.employeeFatherNameLength = true;
  //   } else if (!NO_LATIN_REGEX.test(elem.employeeFatherName)) {
  //     elem.errors.employeeFatherNameLanguage = true;
  //   }
  // }

  public validateEmployeeRNOKPP(elem: any): void {
    if (!elem.employeeRNOKPP) {
      elem.errors.employeeRNOKPPEmpty = true;
    } else if (!RNOKPP_REGEX.test(elem.employeeRNOKPP.toString())) {
      elem.errors.employeeRNOKPPFormat = true;
    }
  }

  public validateEmployeeAssignedRole(elem: any): void {
    if (!elem.employeeAssignedRole) {
      elem.errors.employeeAssignedRoleEmpty = true;
    } else if (
      elem.employeeAssignedRole !== ImportEmployeesChosenRole.employee &&
      elem.employeeAssignedRole !== ImportEmployeesChosenRole.deputyDirector
    ) {
      elem.errors.employeeAssignedRoleFormat = true;
    }
  }

  private validateField(fieldName: string, elem: any): void {
    if (!elem[fieldName]) {
      elem.errors[`${fieldName}Empty`] = true;
    } else if (elem[fieldName].length <= 2 || elem[fieldName].length > 50) {
      elem.errors[`${fieldName}Length`] = true;
    } else if (!NO_LATIN_REGEX.test(elem[fieldName])) {
      elem.errors[`${fieldName}Language`] = true;
    }
  }
}
