import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/account/register',
    pathMatch: 'full',
  },
  {
    path: 'account/register',
    loadComponent: () =>
      import('../app/pages/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'notes-list',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../app/pages/notes/notes.component').then(
        (m) => m.NotesComponent,
      ),
  },
];
