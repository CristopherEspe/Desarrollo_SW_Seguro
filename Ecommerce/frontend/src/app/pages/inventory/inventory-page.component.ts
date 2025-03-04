import { Component, OnInit } from '@angular/core';
import { InventoryDto, InventoryService } from '@app/services/inventory.service';
import { ProductService } from '@app/services/product.service';
import { AuthService } from '@app/services/auth.service';
import { ToastService } from '@app/services/toast.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { lastValueFrom } from 'rxjs';
import { ProductDto } from '@app/models/product.dto';

@Component({
  standalone: true,
  templateUrl: './inventory-page.component.html',
  imports: [
    SharedModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule
  ]
})
export class InventoryPageComponent implements OnInit {
  public inventories: InventoryDto[] = [];
  public products: ProductDto[] = [];
  public displayDialog: boolean = false;
  public selectedInventory: InventoryDto = { id: 0, productId: 0, stock: 0, lastUpdated: '' };

  constructor(
    private inventoryService: InventoryService,
    private productService: ProductService,
    private toastService: ToastService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadInventories();
    this.loadProducts();
  }

  public async loadInventories(): Promise<void> {
    try {
      this.inventories = await lastValueFrom(this.inventoryService.getAll());
    } catch (error) {
      this.toastService.showError('Error', 'Error al cargar el inventario');
    }
  }

  public async loadProducts(): Promise<void> {
    try {
      this.products = await lastValueFrom(this.productService.getAll());
    } catch (error) {
      this.toastService.showError('Error', 'Error al cargar los productos');
    }
  }

  public showCreateDialog(): void {
    this.selectedInventory = { id: 0, productId: 0, stock: 0, lastUpdated: '' };
    this.displayDialog = true;
  }

  public showEditDialog(inventory: InventoryDto): void {
    this.selectedInventory = { ...inventory };
    this.displayDialog = true;
  }

  public async saveInventory(): Promise<void> {
    try {
      if (this.selectedInventory.id === 0) {
        // Crear nuevo inventario
        const newInventory = await lastValueFrom(this.inventoryService.createInventory(
          this.selectedInventory.productId,
          this.selectedInventory.stock
        ));
        this.inventories.push(newInventory);
        this.toastService.showSuccess('Éxito', 'Inventario creado');
      } else {
        // Actualizar inventario con valor absoluto
        const updatedInventory = await lastValueFrom(this.inventoryService.setStock(
          this.selectedInventory.productId,
          this.selectedInventory.stock
        ));
        const index = this.inventories.findIndex(i => i.id === updatedInventory.id);
        this.inventories[index] = updatedInventory;
        this.toastService.showSuccess('Éxito', 'Inventario actualizado');
      }
      this.displayDialog = false;
    } catch (error) {
      this.toastService.showError('Error', 'Error al guardar el inventario');
    }
  }

  public async deleteInventory(productId: number): Promise<void> {
    try {
      await lastValueFrom(this.inventoryService.deleteInventory(productId));
      this.inventories = this.inventories.filter(i => i.productId !== productId);
      this.toastService.showSuccess('Éxito', 'Inventario eliminado');
    } catch (error) {
      this.toastService.showError('Error', 'Error al eliminar el inventario');
    }
  }

  public getProductName(productId: number): string {
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : 'Producto no encontrado';
  }

  validateInteger(event: any) {
    const value = event.target.value;
    if (!Number.isInteger(Number(value))) {
      event.target.value = Math.floor(Number(value));
      this.selectedInventory.stock = Math.floor(Number(value));
    }
  }
}