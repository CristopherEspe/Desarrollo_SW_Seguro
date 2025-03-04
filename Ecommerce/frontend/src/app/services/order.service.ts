import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { OrderDto, OrderStatus } from '@app/models/order.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.api.urls.serviceOrders}/orders`;

  constructor(private client: HttpClient) {}

  public getAllOrders(): Observable<OrderDto[]> {
    return this.client.get<OrderDto[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error('Error fetching all orders:', error);
        throw error;
      })
    );
  }

  public getOrderById(orderId: number): Observable<OrderDto> {
    return this.client.get<OrderDto>(`${this.baseUrl}/${orderId}`).pipe(
      catchError(error => {
        console.error('Error fetching order by ID:', error);
        throw error;
      })
    );
  }

  public createOrderFromCart(userId: string): Observable<OrderDto> {
    return this.client.post<OrderDto>(`${this.baseUrl}/create/${userId}`, null).pipe(
      catchError(error => {
        console.error('Error creating order:', error);
        throw error;
      })
    );
  }

  public getOrdersByUserId(userId: string): Observable<OrderDto[]> {
    return this.client.get<OrderDto[]>(`${this.baseUrl}/user/${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching orders by user ID:', error);
        throw error;
      })
    );
  }

  public updateOrderStatus(orderId: number, status: OrderStatus): Observable<OrderDto> {
    const params = new HttpParams().set('status', status);
    return this.client.put<OrderDto>(`${this.baseUrl}/${orderId}/status`, null, { params }).pipe(
      catchError(error => {
        console.error('Error updating order status:', error);
        throw error;
      })
    );
  }

  public shipOrder(orderId: number, trackingNumber: string): Observable<OrderDto> {
    const params = new HttpParams().set('trackingNumber', trackingNumber);
    return this.client.post<OrderDto>(`${this.baseUrl}/${orderId}/ship`, null, { params }).pipe(
      catchError(error => {
        console.error('Error shipping order:', error);
        throw error;
      })
    );
  }

  public processPayment(orderId: number, paymentMethodId: string): Observable<OrderDto> {
    const params = new HttpParams().set('paymentMethodId', paymentMethodId);
    return this.client.post<OrderDto>(`${this.baseUrl}/${orderId}/pay`, null, { params }).pipe(
      catchError(error => {
        console.error('Error processing payment:', error);
        throw error;
      })
    );
  }
}