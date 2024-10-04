import { Injectable } from '@angular/core';
import { AbstractSecurityStorage } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class LocalSessionManagerService implements AbstractSecurityStorage {
  public read(key: string): JSON | null {
    const item = localStorage.getItem(key);

    return item ? JSON.parse(item) : null;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public write(key: string, value: any): boolean {
    value = value || null;

    localStorage.setItem(key, JSON.stringify(value));

    return true;
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}
