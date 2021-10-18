import { Injectable } from '@angular/core';
import { AbstractSecurityStorage } from 'angular-auth-oidc-client';
@Injectable({
  providedIn: 'root'
})
export class LocalSessionManagerService implements AbstractSecurityStorage {
  constructor() { }
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  read(key: string): JSON | null {
    let item = localStorage.getItem(key);
    return !!item ? JSON.parse(item) : null;
  }

  write(key: string, value: any): boolean {
    value = value || null;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }
}
