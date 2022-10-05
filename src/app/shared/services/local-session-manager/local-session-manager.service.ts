import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalSessionManagerService {
  constructor() { }
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  read(key: string): JSON | null {
    const item = localStorage.getItem(key);
    return !!item ? JSON.parse(item) : null;
  }

  write(key: string, value: any): boolean {
    value = value || null;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }
}
