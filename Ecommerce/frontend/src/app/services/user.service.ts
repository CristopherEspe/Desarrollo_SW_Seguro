import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { UserDto } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.api.urls.serviceUsers}`;

  constructor(private client: HttpClient) {}

  public getCurrentUser(): Observable<UserDto> {
    const url = `${this.baseUrl}/auth/me`;
    console.log('Requesting URL:', url);
    return this.client.get<UserDto>(url).pipe(
      catchError(error => {
        console.error('Error fetching current user:', error);
        throw error;
      })
    );
  }

  public addToCart(userId: string, productId: number, quantity: number, unitPrice: number): Observable<UserDto> {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('quantity', quantity.toString())
      .set('unitPrice', unitPrice.toString());
    const url = `${this.baseUrl}/users/${userId}/cart/add`; // Ruta del UserController
    return this.client.post<UserDto>(url, null, { params }).pipe(
      catchError(error => {
        console.error('Error adding to cart:', error);
        throw error;
      })
    );
  }

  public clearCart(userId: string): Observable<UserDto> {
    const url = `${this.baseUrl}/users/cart/clear/${userId}`; // Ruta del UserController
    return this.client.post<UserDto>(url, null).pipe(
      catchError(error => {
        console.error('Error clearing cart:', error);
        throw error;
      })
    );
  }
}