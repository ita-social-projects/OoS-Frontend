import { Role } from 'shared/enum/role';
import { Workshop, WorkshopDraftState } from 'shared/models/workshop.model';
import { forkJoin, Observable } from 'rxjs';

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

export function blobToBase64(blob: Blob): Observable<string> {
  return new Observable<string>((subscriber) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    reader.onloadend = () => {
      subscriber.next(reader.result as string);
      subscriber.complete();
    };
  });
}

export function blobsToBase64(blobs: Blob[]): Observable<string[]> {
  const observables = blobs.map((blob) => blobToBase64(blob));
  return forkJoin(observables);
}
