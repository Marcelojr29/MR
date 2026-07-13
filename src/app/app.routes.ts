import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/tasks').then((m) => m.Tasks),
      },
      {
        path: 'shopping-list',
        loadComponent: () =>
          import('./features/shopping-list/shopping-list').then((m) => m.ShoppingList),
      },
      {
        path: 'bills',
        loadComponent: () => import('./features/bills/bills').then((m) => m.Bills),
      },
      {
        path: 'finance',
        loadComponent: () => import('./features/finance/finance').then((m) => m.Finance),
      },
      {
        path: 'priorities',
        loadComponent: () =>
          import('./features/priorities/priorities').then((m) => m.Priorities),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
