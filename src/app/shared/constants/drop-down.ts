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

export const ProviderAdminOptions = [
  {
    value: 'All',
    label: 'HISTORY_LOG.PROVIDER_ADMIN_FILTERS.ALL',
    default: true
  },
  {
    value: 'Deputies',
    label: 'HISTORY_LOG.PROVIDER_ADMIN_FILTERS.DEPUTIES'
  },
  {
    value: 'Assistants',
    label: 'HISTORY_LOG.PROVIDER_ADMIN_FILTERS.ASSISTANTS'
  }
];

export const ProviderAdminOperationOptions = [
  {
    value: 'Create',
    label: 'HISTORY_LOG.PROVIDER_ADMIN_FILTERS.ADD_ADMIN_OPTION',
    type: ['Assistants']
  },
  {
    value: 'Delete',
    label: 'HISTORY_LOG.PROVIDER_ADMIN_FILTERS.REMOVE_ADMIN_OPTION',
    type: ['Assistants']
  },
  {
    value: 'Block',
    label: 'HISTORY_LOG.PROVIDER_ADMIN_FILTERS.BLOCK_ADMIN_OPTION'
  },
  {
    value: 'Update',
    label: 'HISTORY_LOG.PROVIDER_ADMIN_FILTERS.UPDATE_ADMIN_OPTION'
  },
  {
    value: 'Reinvite',
    label: 'HISTORY_LOG.PROVIDER_ADMIN_FILTERS.REINVITE_ADMIN_OPTION'
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
  [CustomFormControlNames.AdminType]: ProviderAdminOptions,
  [CustomFormControlNames.OperationType]: ProviderAdminOperationOptions,
  [CustomFormControlNames.ApplicationsPropertyName]: ApplicationOptions,
  [CustomFormControlNames.ShowParents]: ParentsBlockingByAdminOptions
};
