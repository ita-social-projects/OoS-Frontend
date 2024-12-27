export interface ValidEmployee {
  id: number;
  employeeSurname: string;
  employeeName: string;
  employeeFatherName: string;
  employeeRNOKPP: number;
  employeeAssignedRole: string;
}
export interface Employee {
  sequenceNumber: number;
  employeeSurname: string;
  employeeName: string;
  employeeFatherName: string;
  employeeRNOKPP: number;
  employeeAssignedRole: string;
  errors: EmployeeValidationErrors;
}

export interface EmployeeValidationErrors {
  employeeSurnameEmpty?: boolean;
  employeeNameEmpty?: boolean;
  employeeFatherNameEmpty?: boolean;
  employeeRNOKPPEmpty?: boolean;
  employeeAssignedRoleEmpty?: boolean;

  employeeSurnameLength?: boolean;
  employeeNameLength?: boolean;
  employeeFatherNameLength?: boolean;

  employeeSurnameLanguage?: boolean;
  employeeNameLanguage?: boolean;
  employeeFatherNameLanguage?: boolean;

  employeeRNOKPPFormat?: boolean;
  employeeRNOKPPDuplicate?: boolean;
  employeeAssignedRoleFormat?: boolean;
}

export interface FieldValidationConfig {
  checkEmpty?: boolean;
  checkLength?: boolean;
  checkLanguage?: boolean;
  checkAssignedRole?: boolean;
  checkRNOKPP?: boolean;
  checkDuplicate?: boolean;
}

export interface FieldsConfig {
  fieldName: string;
  validationParam: FieldValidationConfig;
}
