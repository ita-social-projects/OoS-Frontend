import { Role } from 'shared/enum/role';
import { WorkshopDraftState } from 'shared/models/workshop.model';
import { Workshop } from 'shared/models/workshop.model';

export const ProviderRoles = [Role.provider, Role.providerDeputy, Role.employee];

export function isRoleProvider(role: string | Role): boolean {
  return ProviderRoles.includes(role as Role);
}

export function workshopToDraftState(workshop: Workshop): WorkshopDraftState {
  return {
    workshopForLoading: workshop
  };
}
export function formatToClientDate(serverDate: string | null): Date | null {
  if (!serverDate) {
    return null;
  }

  const parts = serverDate.split('-').map(Number);
  const [year, month, day] = parts;
  const dateObj = new Date(Date.UTC(year, month - 1, day));
  if (isNaN(dateObj.getTime())) {
    return null;
  }

  return dateObj;
}
