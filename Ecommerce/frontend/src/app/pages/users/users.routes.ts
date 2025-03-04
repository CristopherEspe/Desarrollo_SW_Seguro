import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Mi Perfil',
    loadComponent: async () => (await import('./users-page.component')).UsersPageComponent,
  }
];