import {CanDeactivate} from '@angular/router';
import {Injectable} from '@angular/core';
import {ProviderConfigComponent} from './provider-config.component';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';
import {ProviderConfigModalComponent} from './provider-config-modal/provider-config-modal.component';

@Injectable({providedIn: 'root'})
export class CanDeactivateGuard implements CanDeactivate<ProviderConfigComponent> {
  value: any;

  constructor(private dialog: MatDialog) {
  }

  canDeactivate(component: ProviderConfigComponent): Observable<boolean> {
    if (component.orgFormGroup.dirty || component.addressFormGroup.dirty || component.photoFormGroup.dirty) {
      return this.confirmDialog();
    }
    return of(true);
  }

  confirmDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(ProviderConfigModalComponent);
    return dialogRef.afterClosed();
  }
}

