import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  readItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  saveItem(key: string, value: string) {
    this.storage.setItem(key, value);
  }

  deleteItem(key: string) {
    this.storage.removeItem(key);
  }

  exists(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }
}
