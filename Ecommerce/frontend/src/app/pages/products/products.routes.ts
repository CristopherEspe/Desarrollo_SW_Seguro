import { Routes } from '@angular/router';
import { AdminGuard } from '@app/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Productos',
    loadComponent: async () => (await import('./public/public-products-page.component')).PublicProductsPageComponent
  },
  {
    path: 'admin',
    title: 'Gestión de Productos',
    loadComponent: async () => (await import('./products-page.component')).ProductsPageComponent,
    canActivate: [AdminGuard]
  }
];