import { Role } from 'shared/enum/role';
import { UnfinishedWorkshopAbout, Workshop, WorkshopAbout, WorkshopDraftState } from 'shared/models/workshop.model';
import { forkJoin, Observable, of } from 'rxjs';
import { Competition, CompetitionRequired, Description, UnfinishedCompetitionRequired } from 'shared/models/competition.model';
import { Util } from 'shared/utils/utils';
import { WorkshopType } from 'shared/enum/workshop';
import { map } from 'rxjs/operators';

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
    reader.onloadend = (): void => {
      subscriber.next(reader.result as string);
      subscriber.complete();
    };
  });
}

export function blobsToBase64(blobs: Blob[]): Observable<string[]> {
  if (!blobs?.length) {
    return of([]);
  }
  const observables = blobs.map((blob) => blobToBase64(blob));
  return forkJoin(observables);
}

export function base64ToFile(base64: string, filename: string = 'image'): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function base64ArrayToFiles(base64Array: string[]): File[] {
  return base64Array.map((b64) => base64ToFile(b64));
}

export function shouldBeDraft(original: Workshop | Competition, changed: Workshop | Competition, fieldsToCheck: string[]): boolean {
  return fieldsToCheck.some((fieldName) => {
    if (typeof changed[fieldName] === 'object' && typeof original[fieldName] === 'object') {
      return !Util.deepEqual(changed[fieldName], original[fieldName]);
    }

    return changed[fieldName] !== original[fieldName] && (!Util.isEmpty(changed[fieldName]) || !Util.isEmpty(original[fieldName]));
  });
}

export function submittingRealEntity(entityParam: string): boolean {
  return entityParam !== WorkshopType.Draft;
}

export function createUnfinishedAbout(
  aboutInfo: WorkshopAbout | CompetitionRequired
): Observable<UnfinishedWorkshopAbout | UnfinishedCompetitionRequired> {
  const file = aboutInfo.coverImage[0];

  if (!file) {
    return of({
      ...aboutInfo,
      base64CoverImage: aboutInfo.base64CoverImage || null
    });
  }

  return blobToBase64(file).pipe(
    map((base64CoverImage) => ({
      ...aboutInfo,
      base64CoverImage
    }))
  );
}

export function createUnfinishedDescription<T extends { imageFiles?: Blob[]; base64ImageFiles?: string[] }>(
  descriptionInfo: T
): Observable<
  T & {
    base64ImageFiles: string[];
  }
> {
  const files: Blob[] = Array.isArray(descriptionInfo.imageFiles) ? descriptionInfo.imageFiles : [];
  return blobsToBase64(files).pipe(
    map((base64ImageFiles) => ({
      ...descriptionInfo,
      base64ImageFiles: [...base64ImageFiles, ...(descriptionInfo.base64ImageFiles || [])]
    }))
  );
}

export function mapDescriptionInfo(descInfo: Description): any {
  descInfo.competitiveEventDescriptionItems.forEach((item) => {
    delete item.competitiveEventId;
  });

  const mapped = {
    ...descInfo,
    plannedFormatOfClasses: descInfo.formOfLearning
  };

  if (mapped.directionId && mapped.subDirectionIds?.length) {
    mapped.directionSubDirectionIds = mapped.subDirectionIds.map((subDirectionId) => ({
      directionId: mapped.directionId,
      subDirectionId
    }));
  }

  return Object.fromEntries(Object.entries(mapped).filter(([_, value]) => value));
}
