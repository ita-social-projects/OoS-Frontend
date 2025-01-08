import { Injectable } from '@angular/core';
import { StorageEngine } from '@ngxs/storage-plugin';

@Injectable()
export class LocalStorageEngine implements StorageEngine {
  public get length(): number {
    return localStorage.length;
  }

  public getItem(key: string): any {
    return localStorage.getItem(key);
  }

  public setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}
