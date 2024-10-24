export interface ValidEmployee {
  id: number;
  employeeSurname: string;
  employeeName: string;
  employeeFatherName: string;
  employeeRNOKPP: number;
  employeeAssignedRole: string;
}
export interface Employee {
  employeeSurname: string;
  employeeName: string;
  employeeFatherName: string;
  employeeRNOKPP: number;
  employeeAssignedRole: string;
  errors: EmployeeValidationErrors;
}
export interface EmployeeId extends Employee {
  id: number;
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
  employeeAssignedRoleFormat?: boolean;
}

export interface FieldValidationConfig {
  checkEmpty?: boolean;
  checkLength?: boolean;
  checkLanguage?: boolean;
  checkAssignedRole?: boolean;
  checkRNOKPP?: boolean;
}

export interface FieldsConfig {
  fieldName: string;
  validationParam: FieldValidationConfig;
}

// export interface ValidProvider {
//   id: number;
//   directorsName: string;
//   directorsSurname: string;
//   providerName: string;
//   ownership: string;
//   identifier: number;
//   licenseNumber: number;
//   settlement: string;
//   address: string;
//   email: string;
//   phoneNumber: number;
// }

// export interface Provider {
//   directorsName: string;
//   directorsSurname: string;
//   providerName: string;
//   ownership: string;
//   identifier: number;
//   licenseNumber: number;
//   settlement: string;
//   errors: ProviderValidationErrors;
//   address: string;
//   email: string;
//   phoneNumber: number;
// }
// export interface ProviderId extends Provider {
//   id: number;
// }

// export interface ProviderValidationErrors {
//   directorsNameEmpty?: boolean;
//   directorsSurnameEmpty?: boolean;
//   providerNameEmpty?: boolean;
//   providerNameLength?: boolean;
//   ownershipEmpty?: boolean;
//   identifierEmpty?: boolean;
//   identifierFormat?: boolean;
//   identifierDuplicate?: boolean;
//   licenseNumberEmpty?: boolean;
//   settlementEmpty?: boolean;
//   settlementLength?: boolean;
//   settlementLanguage?: boolean;
//   addressEmpty?: boolean;
//   addressLanguage?: boolean;
//   emailEmpty?: boolean;
//   emailFormat?: boolean;
//   emailDuplicate?: boolean;
//   phoneNumberEmpty?: boolean;
//   phoneNumberFormat?: boolean;
// }
