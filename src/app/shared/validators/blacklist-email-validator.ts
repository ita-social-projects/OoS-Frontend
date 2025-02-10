import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function BlacklistEmailValidator(blockedDomains: string[] = ['.ru', '.rf', '.su', '.by']): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;

    if (!email) {
      return null;
    }

    const emailParts = email.toLowerCase().trim().split('@');
    if (emailParts.length !== 2) {
      return null;
    }
    const domain = emailParts[1];
    const isBlacklisted = blockedDomains.some(
      (blockedDomain) => domain === blockedDomain.substring(1) || domain.endsWith('.' + blockedDomain.substring(1))
    );
    return isBlacklisted ? { blacklistedDomain: true } : null;
  };
}
