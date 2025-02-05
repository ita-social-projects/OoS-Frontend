import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function BlacklistEmailValidator(blockedDomains: string[] = ['.ru', '.rf', '.su', '.by']): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;

    if (!email) {
      return null;
    }

    const isBlacklisted = blockedDomains.some((domain) => email.toLowerCase().trim().endsWith(domain));
    return isBlacklisted ? { blacklistedDomain: true } : null;
  };
}
