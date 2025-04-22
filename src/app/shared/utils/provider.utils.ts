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
export function formatDateOnlyForServer(date: Date | string | null): string | null {
  if (!date) {
    return null;
  }

  try {
    let dateObj: Date;

    if (date instanceof Date) {
      dateObj = date;
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      // format ДД/ММ/РРРР
      const [day, month, year] = date.split('/');
      dateObj = new Date(`${year}-${month}-${day}`);
    } else {
      // format ISO/РРРР-ММ-ДД
      dateObj = new Date(date);
    }

    // // Перевірка на валідність дати
    // if (isNaN(dateObj.getTime())) {
    //   return null;
    // }

    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    return null;
  }
}

export function formatToClientDate(serverDate: string | null): string | null {
  if (!serverDate || !/^\d{4}-\d{2}-\d{2}$/.test(serverDate)) {
    return null;
  }
  const [year, month, day] = serverDate.split('-');
  return `${day}/${month}/${year}`;
}
