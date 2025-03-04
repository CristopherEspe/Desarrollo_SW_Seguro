import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { ProductService } from '@app/services/product.service';
import { OrderService } from '@app/services/order.service';
import { AuthService } from '@app/services/auth.service';
import { ToastService } from '@app/services/toast.service';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '@app/shared';
import { lastValueFrom } from 'rxjs';
import { ProductDto } from '@app/models/product.dto';
import { UserDto } from '@app/models';

interface CartProduct {
  product: ProductDto;
  quantity: number;
}

@Component({
  standalone: true,
  templateUrl: './users-page.component.html',
  imports: [SharedModule, TableModule, ButtonModule]
})
export class UsersPageComponent implements OnInit {
  public user: UserDto | null = null;
  public cartProducts: CartProduct[] = [];

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService,
    private toastService: ToastService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  public async loadUser(): Promise<void> {
    try {
      this.user = await lastValueFrom(this.userService.getCurrentUser());
      if (this.user?.cartItems?.length) {
        const productIds = this.user.cartItems.map(item => item.productId);
        const products = await lastValueFrom(this.productService.fetchByIds(productIds));
        this.cartProducts = products.map(product => ({
          product,
          quantity: this.getQuantityForProduct(product.id)
        }));
      }
    } catch (error) {
      this.toastService.showError('Error', 'Error al cargar el perfil del usuario');
    }
  }

  public async clearCart(): Promise<void> {
    try {
      if (this.user?.keycloakId) {
        this.user = await lastValueFrom(this.userService.clearCart(this.user.keycloakId));
        this.cartProducts = [];
        this.toastService.showSuccess('Éxito', 'Carrito limpiado correctamente');
      }
    } catch (error) {
      this.toastService.showError('Error', 'Error al limpiar el carrito');
    }
  }

  public async createOrder(): Promise<void> {
    try {
      if (this.user?.keycloakId) {
        await lastValueFrom(this.orderService.createOrderFromCart(this.user.keycloakId));
        this.user = await lastValueFrom(this.userService.getCurrentUser()); // Refrescar usuario
        this.cartProducts = [];
        this.toastService.showSuccess('Éxito', 'Orden creada correctamente');
        this.router.navigate(['/orders']);
      }
    } catch (error) {
      this.toastService.showError('Error', 'Error al crear la orden');
    }
  }

  private getQuantityForProduct(productId: number): number {
    return this.user?.cartItems.find(item => item.productId === productId)?.quantity || 0;
  }
}