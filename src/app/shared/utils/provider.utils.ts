import { Role } from 'shared/enum/role';
import { Workshop, WorkshopDraftState } from 'shared/models/workshop.model';
import { forkJoin, merge, Observable, of, Subject, throttleTime } from 'rxjs';
import { Competition } from 'shared/models/competition.model';
import { Util } from 'shared/utils/utils';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { filter, takeUntil } from 'rxjs/operators';
import { UpdateCompetition, UpdateWorkshop } from 'shared/store/provider.actions';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { WorkshopType } from 'shared/enum/workshop';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ShowMessageBar } from 'shared/store/app.actions';

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

export function showDraftConfirmationDialog(store: Store, dialog: MatDialog, entity: Workshop | Competition): void {
  dialog
    .open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.draftEditSet
      }
    })
    .afterClosed()
    .pipe(filter(Boolean))
    .subscribe(() => {
      if (entity instanceof Workshop) {
        store.dispatch(new UpdateWorkshop(entity));
      }
      if (entity instanceof Competition) {
        store.dispatch(new UpdateCompetition(entity));
      }
    });
}

export function submittingRealEntity(entityParam: string): boolean {
  return entityParam !== WorkshopType.Draft;
}

export function listenToChanges(
  fieldsToListen: string[],
  form: FormGroup,
  store: Store,
  translateService: TranslateService,
  destroy$: Subject<boolean>
): void {
  const mappedFields = fieldsToListen.map(
    (controlName) =>
      form.get(controlName)?.valueChanges.pipe(
        throttleTime(5000, undefined, {
          leading: true,
          trailing: false
        })
      ) ?? of()
  );

  merge(...mappedFields)
    .pipe(takeUntil(destroy$))
    .subscribe(() => {
      store.dispatch(
        new ShowMessageBar({
          message: translateService.instant('SERVICE_MESSAGES.SNACK_BAR_TEXT.CHANGE_REQUIRES_MODERATION'),
          type: 'warningYellow'
        })
      );
    });
}
