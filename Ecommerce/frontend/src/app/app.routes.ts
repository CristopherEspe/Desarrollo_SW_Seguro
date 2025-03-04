import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'users',
    loadChildren: async () => (await import('@app/pages/users')).routes,
  },
  {
    path: 'products',
    loadChildren: async () => (await import('@app/pages/products')).routes,
  },
  {
    path: 'inventory',
    loadChildren: async () => (await import('@app/pages/inventory')).routes,
  },
  {
    path: 'orders',
    loadChildren: async () => (await import('@app/pages/orders')).routes,
  },
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  }
];
