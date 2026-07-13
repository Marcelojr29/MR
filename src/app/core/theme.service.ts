import { Injectable, signal } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'nossa-casa-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly preference = signal<ThemePreference>(readStoredPreference());

  readonly isDark = signal(computeIsDark(this.preference()));

  constructor() {
    this.apply(this.preference());
  }

  setPreference(preference: ThemePreference) {
    this.preference.set(preference);
    localStorage.setItem(STORAGE_KEY, preference);
    this.apply(preference);
  }

  toggle() {
    this.setPreference(this.isDark() ? 'light' : 'dark');
  }

  private apply(preference: ThemePreference) {
    document.documentElement.style.colorScheme = preference === 'system' ? 'light dark' : preference;
    this.isDark.set(computeIsDark(preference));
  }
}

function computeIsDark(preference: ThemePreference): boolean {
  if (preference === 'dark') return true;
  if (preference === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readStoredPreference(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}
