import { Routes } from '@angular/router';
import { AdminGuard } from '@app/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Gestión de Inventario',
    loadComponent: async () => (await import('./inventory-page.component')).InventoryPageComponent,
    canActivate: [AdminGuard]
  }
];