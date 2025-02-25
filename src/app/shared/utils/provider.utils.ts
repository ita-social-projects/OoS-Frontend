import { Role } from 'shared/enum/role';
import { WorkshopDraftState } from 'shared/models/draftWorkshop.model';
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
