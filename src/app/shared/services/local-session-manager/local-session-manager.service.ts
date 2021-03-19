import { Injectable } from '@angular/core';
import { AbstractSecurityStorage } from 'angular-auth-oidc-client';
@Injectable({
  providedIn: 'root'
})
export class LocalSessionManagerService implements AbstractSecurityStorage{
  constructor() { }
  remove(key: string): void {
    localStorage.removeItem(key);
  }
  read(key: string) {
    let item = localStorage.getItem(key);
    if (!!item) {
      return JSON.parse(item);
    }
    else {
      return null;
    }
  }
  write(key: string, value: any) {
    value = value || null;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }
}
