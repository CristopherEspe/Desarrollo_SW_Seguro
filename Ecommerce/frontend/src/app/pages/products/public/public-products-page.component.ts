import { Component, OnInit } from '@angular/core';
import { ProductService } from '@app/services/product.service';
import { UserService } from '@app/services/user.service';
import { AuthService } from '@app/services/auth.service';
import { ToastService } from '@app/services/toast.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { lastValueFrom } from 'rxjs';
import { ProductDto } from '@app/models/product.dto';

@Component({
  standalone: true,
  templateUrl: './public-products-page.component.html',
  imports: [SharedModule, TableModule, ButtonModule, InputTextModule, FormsModule]
})
export class PublicProductsPageComponent implements OnInit {
  public products: ProductDto[] = [];
  public searchQuery: string = '';

  constructor(
    private productService: ProductService,
    private userService: UserService,
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

  public async addToCart(product: ProductDto): Promise<void> {
    try {
      const user = await lastValueFrom(this.userService.getCurrentUser());
      if (user?.keycloakId) {
        await lastValueFrom(this.userService.addToCart(user.keycloakId, product.id, 1, product.price));
        this.toastService.showSuccess('Éxito', `${product.name} añadido al carrito`);
      }
    } catch (error) {
      this.toastService.showError('Error', 'Error al añadir al carrito');
    }
  }
}