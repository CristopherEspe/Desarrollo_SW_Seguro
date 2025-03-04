import { Routes } from '@angular/router';
import { AdminGuard } from '@app/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Mis Órdenes',
    loadComponent: async () => (await import('./orders-page.component')).OrdersPageComponent
  },
  {
    path: 'admin',
    title: 'Todas las Órdenes',
    loadComponent: async () => (await import('./admin/admin-orders-page.component')).AdminOrdersPageComponent,
    canActivate: [AdminGuard]
  }
];