import { Component, OnInit } from '@angular/core';
import { OrderService } from '@app/services/order.service';
import { AuthService } from '@app/services/auth.service';
import { ToastService } from '@app/services/toast.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { lastValueFrom } from 'rxjs';
import { OrderDto, OrderItemDto } from '@app/models/order.dto';

interface OrderTableItem {
  order: OrderDto;
  itemsFormatted: string;
}

@Component({
  standalone: true,
  templateUrl: './admin-orders-page.component.html',
  imports: [SharedModule, TableModule, ButtonModule, InputTextModule, DialogModule, FormsModule]
})
export class AdminOrdersPageComponent implements OnInit {
  public orders: OrderTableItem[] = [];
  public displayPaymentDialog: boolean = false;
  public selectedOrderId: number | null = null;
  public paymentMethodId: string = '';

  constructor(
    private orderService: OrderService,
    private toastService: ToastService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAllOrders();
  }

  public async loadAllOrders(): Promise<void> {
    try {
      if (this.authService.hasRole('admin')) {
        const rawOrders = await lastValueFrom(this.orderService.getAllOrders());
        this.orders = rawOrders.map(order => ({
          order,
          itemsFormatted: this.formatOrderItems(order.items)
        }));
      } else {
        this.toastService.showError('Error', 'Acceso denegado');
      }
    } catch (error) {
      this.toastService.showError('Error', 'Error al cargar las órdenes');
    }
  }

  public showPaymentDialog(orderId: number): void {
    this.selectedOrderId = orderId;
    this.paymentMethodId = '';
    this.displayPaymentDialog = true;
  }

  public async payOrder(): Promise<void> {
    try {
      if (this.selectedOrderId) {
        const updatedOrder = await lastValueFrom(this.orderService.processPayment(this.selectedOrderId, this.paymentMethodId || 'test_payment_method'));
        const index = this.orders.findIndex(item => item.order.id === this.selectedOrderId);
        this.orders[index] = { order: updatedOrder, itemsFormatted: this.formatOrderItems(updatedOrder.items) };
        this.toastService.showSuccess('Éxito', 'Pago procesado');
        this.displayPaymentDialog = false;
      }
    } catch (error) {
      this.toastService.showError('Error', 'Error al procesar el pago');
    }
  }

  public async shipOrder(orderId: number): Promise<void> {
    try {
      const updatedOrder = await lastValueFrom(this.orderService.shipOrder(orderId, 'TRACK' + Date.now()));
      const index = this.orders.findIndex(item => item.order.id === orderId);
      this.orders[index] = { order: updatedOrder, itemsFormatted: this.formatOrderItems(updatedOrder.items) };
      this.toastService.showSuccess('Éxito', 'Orden enviada');
    } catch (error) {
      this.toastService.showError('Error', 'Error al enviar la orden');
    }
  }

  private formatOrderItems(items: OrderItemDto[]): string {
    return items.map(item => `${item.productId} (x${item.quantity})`).join(', ');
  }
}