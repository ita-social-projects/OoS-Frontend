import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { ProviderConfigComponent } from './provider-config.component';

@Injectable({providedIn: 'root'})
export class CanDeactivateGuard implements CanDeactivate<ProviderConfigComponent> {
  canDeactivate(component: ProviderConfigComponent): boolean {
    if (component.orgFormGroup.dirty || component.addressFormGroup.dirty || component.photoFormGroup.dirty) {
      return confirm('У вас є не збережені дані, покинути сторінку?');
    }
    return true;
  }
}
