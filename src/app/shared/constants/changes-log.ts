export class ColumnsListForChangesLogHistory {
  static readonly Providers = [
    'pib',
    'email',
    'providerTitle',
    'institutionTitle',
    'providerCity',
    'fieldName',
    'updatedDate',
    'oldValue',
    'newValue'
  ];

  static readonly Employees = [
    'pib',
    'email',
    'providerTitle',
    'workshopTitle',
    'institutionTitle',
    'providerCity',
    'fieldName',
    'updatedDate',
    'oldValue',
    'newValue'
  ];

  static readonly Applications = [
    'pib',
    'email',
    'providerTitle',
    'institutionTitle',
    'providerCity',
    'fieldName',
    'updatedDate',
    'oldValue',
    'newValue'
  ];

  static readonly Users = ['parentFullName', 'operationDate', 'isBlocked', 'reason'];
}
