import { InjectionToken } from '@angular/core';

export const EMPTY_DRIVER = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
} as never as Driver;

export interface Driver {
  setItem<Value = unknown>(key: string, value: Value): void;
  removeItem(key: string): void;
  getItem<Value = unknown>(key: string): Value | null;
  clear(): void;
}

export const LocalStorageDriver = new InjectionToken<Driver>('LocalStorage');
