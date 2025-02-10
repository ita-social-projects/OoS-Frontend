import { FormControl } from '@angular/forms';
import { BlacklistEmailValidator } from 'shared/validators/blacklist-email-validator';

describe('BlacklistEmailDomainsValidator', () => {
  const validator = BlacklistEmailValidator();

  it('should return null for valid email domains', () => {
    const control = new FormControl('test@gmail.com');
    expect(validator(control)).toBeNull();
  });

  it('should return error for .ru domain', () => {
    const control = new FormControl('test@example.ru');
    expect(validator(control)).toEqual({ blacklistedDomain: true });
  });

  it('should return error for .rf domain', () => {
    const control = new FormControl('test@mail.rf');
    expect(validator(control)).toEqual({ blacklistedDomain: true });
  });

  it('should return error for .su domain', () => {
    const control = new FormControl('test@mail.su');
    expect(validator(control)).toEqual({ blacklistedDomain: true });
  });

  it('should return error for .by domain', () => {
    const control = new FormControl('test@example.by');
    expect(validator(control)).toEqual({ blacklistedDomain: true });
  });

  it('should be case-insensitive', () => {
    const control = new FormControl('test@EXAMPLE.RU');
    expect(validator(control)).toEqual({ blacklistedDomain: true });
  });

  it('should handle empty string', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('should handle invalid email format', () => {
    const control = new FormControl('invalid-email');
    expect(validator(control)).toBeNull();
  });

  it('should not block valid domain containing blocked suffix', () => {
    const control = new FormControl('test@guru.com');
    expect(validator(control)).toBeNull();
  });

  it('should block subdomain of blocked domain', () => {
    const control = new FormControl('test@mail.example.ru');
    expect(validator(control)).toEqual({ blacklistedDomain: true });
  });
});
