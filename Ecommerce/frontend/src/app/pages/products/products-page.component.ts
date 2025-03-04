import { Component, OnInit } from '@angular/core';
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
  templateUrl: './products-page.component.html',
  imports: [
    SharedModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule
  ]
})
export class ProductsPageComponent implements OnInit {
  public products: ProductDto[] = [];
  public searchQuery: string = '';
  public displayDialog: boolean = false;
  public selectedProduct: ProductDto = { id: 0, name: '', description: '', price: 0, imageUrl: '', category: '', createdAt: '', updatedAt: '' };

  constructor(
    private productService: ProductService,
    private toastService: ToastService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  public async loadProducts(): Promise<void> {
    try {
      this.products = this.searchQuery
        ? await lastValueFrom(this.productService.search(this.searchQuery))
        : await lastValueFrom(this.productService.getAll());
    } catch (error) {
      this.toastService.showError('Error', 'Error al cargar los productos');
    }
  }

  public showCreateDialog(): void {
    this.selectedProduct = { id: 0, name: '', description: '', price: 0, imageUrl: '', category: '', createdAt: '', updatedAt: '' };
    this.displayDialog = true;
  }

  public showEditDialog(product: ProductDto): void {
    this.selectedProduct = { ...product };
    this.displayDialog = true;
  }

  public async saveProduct(): Promise<void> {
    try {
      if (this.selectedProduct.id === 0) {
        // Crear nuevo producto
        const newProduct = await lastValueFrom(this.productService.create(this.selectedProduct));
        this.products.push(newProduct);
        this.toastService.showSuccess('Éxito', 'Producto creado');
      } else {
        // Actualizar producto existente
        const updatedProduct = await lastValueFrom(this.productService.update(this.selectedProduct));
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        this.products[index] = updatedProduct;
        this.toastService.showSuccess('Éxito', 'Producto actualizado');
      }
      this.displayDialog = false;
    } catch (error) {
      this.toastService.showError('Error', 'Error al guardar el producto');
    }
  }

  public async deleteProduct(id: number): Promise<void> {
    try {
      await lastValueFrom(this.productService.delete(id));
      this.products = this.products.filter(p => p.id !== id);
      this.toastService.showSuccess('Éxito', 'Producto eliminado');
    } catch (error) {
      this.toastService.showError('Error', 'Error al eliminar el producto');
    }
  }
}