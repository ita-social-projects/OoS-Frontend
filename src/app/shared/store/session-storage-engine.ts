import { Injectable } from '@angular/core';
import { StorageEngine } from '@ngxs/storage-plugin';

@Injectable()
export class SessionStorageEngine implements StorageEngine {
  public get length(): number {
    return sessionStorage.length;
  }

  public getItem(key: string): any {
    return sessionStorage.getItem(key);
  }

  public setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  public removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  public clear(): void {
    sessionStorage.clear();
  }
}
