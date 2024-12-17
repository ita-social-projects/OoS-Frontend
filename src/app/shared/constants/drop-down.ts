import { CustomFormControlNames } from 'shared/enum/history.log';

export const ProviderOptions = [
  {
    value: 'FullTitle',
    label: 'FORMS.LABELS.PROVIDER_TITLE'
  },
  {
    value: 'EdrpouIpn',
    label: 'FORMS.LABELS.EDRPO_IPN'
  },
  {
    value: 'Director',
    label: 'FORMS.LABELS.DIRECTOR_NAME'
  },
  {
    value: 'Institution',
    label: 'FORMS.LABELS.SUBORDINATION'
  },
  {
    value: 'LegalAddress',
    label: 'FORMS.HEADERS.LEGAL_ADDRESS'
  }
];

export const EmployeeOptions = [
  {
    value: 'All',
    label: 'HISTORY_LOG.EMPLOYEE_FILTERS.ALL',
    default: true
  },
  {
    value: 'Deputies',
    label: 'HISTORY_LOG.EMPLOYEE_FILTERS.DEPUTIES'
  },
  {
    value: 'Assistants',
    label: 'HISTORY_LOG.EMPLOYEE_FILTERS.ASSISTANTS'
  }
];

export const EmployeeOperationOptions = [
  {
    value: 'Create',
    label: 'HISTORY_LOG.EMPLOYEE_FILTERS.ADD_ADMIN_OPTION',
    type: ['Assistants']
  },
  {
    value: 'Delete',
    label: 'HISTORY_LOG.EMPLOYEE_FILTERS.REMOVE_ADMIN_OPTION',
    type: ['Assistants']
  },
  {
    value: 'Block',
    label: 'HISTORY_LOG.EMPLOYEE_FILTERS.BLOCK_ADMIN_OPTION'
  },
  {
    value: 'Update',
    label: 'HISTORY_LOG.EMPLOYEE_FILTERS.UPDATE_ADMIN_OPTION'
  },
  {
    value: 'Reinvite',
    label: 'HISTORY_LOG.EMPLOYEE_FILTERS.REINVITE_ADMIN_OPTION'
  }
];

export const ApplicationOptions = [
  {
    value: 'Status',
    label: 'FORMS.LABELS.STATUS'
  }
];

export const ParentsBlockingByAdminOptions = [
  {
    value: 'All',
    label: 'HISTORY_LOG.USERS_FILTERS.ALL',
    default: true
  },
  {
    value: 'Blocked',
    label: 'HISTORY_LOG.USERS_FILTERS.BLOCKED'
  },
  {
    value: 'Unblocked',
    label: 'HISTORY_LOG.USERS_FILTERS.UNBLOCKED'
  }
];

export const DropdownOptionsConfig = {
  [CustomFormControlNames.ProvidersPropertyName]: ProviderOptions,
  [CustomFormControlNames.AdminType]: EmployeeOptions,
  [CustomFormControlNames.OperationType]: EmployeeOperationOptions,
  [CustomFormControlNames.ApplicationsPropertyName]: ApplicationOptions,
  [CustomFormControlNames.ShowParents]: ParentsBlockingByAdminOptions
};
