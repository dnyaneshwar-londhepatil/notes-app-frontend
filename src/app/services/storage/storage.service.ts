import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LocalStorageDriver } from './storage-drivers';

export enum StorageKeys {
  AuthToken = 'token',
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public driver = inject(LocalStorageDriver);
  private platformId = inject(PLATFORM_ID);

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  public setKey<Value>(key: StorageKeys, value: Value): void {
    if (!this.isBrowser()) {
      console.warn('StorageService.setKey: Not running in browser context, skipping storage');
      return;
    }
    // Don't JSON stringify - localStorage expects strings
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);
    console.log('StorageService.setKey:', key, 'serialized:', serialized);
    return this.driver.setItem(key, serialized);
  }

  public getKey<Value>(key: StorageKeys): Value | null {
    if (!this.isBrowser()) {
      console.warn('StorageService.getKey: Not running in browser context');
      return null;
    }
    const raw = this.driver.getItem<string>(key);
    console.log('StorageService.getKey:', key, 'raw:', raw);
    if (raw == null || raw === '') {
      return null;
    }
    try {
      // Try to parse as JSON first, if it fails return as string
      return JSON.parse(raw) as Value;
    } catch {
      // If JSON parse fails, return the raw value (for string tokens)
      return raw as Value;
    }
  }

  public removeKey(key: StorageKeys): void {
    if (!this.isBrowser()) {
      console.warn('StorageService.removeKey: Not running in browser context');
      return;
    }
    return this.driver.removeItem(key);
  }
}
