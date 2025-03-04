import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export interface InventoryDto {
  id: number;
  productId: number;
  stock: number;
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private baseUrl = `${environment.api.urls.serviceInventory}/inventory`;

  constructor(private client: HttpClient) {}

  public getAll(): Observable<InventoryDto[]> {
    return this.client.get<InventoryDto[]>(this.baseUrl);
  }

  public getByProductId(productId: number): Observable<InventoryDto> {
    return this.client.get<InventoryDto>(`${this.baseUrl}/product/${productId}`);
  }

  public createInventory(productId: number, initialStock: number): Observable<InventoryDto> {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('initialStock', initialStock.toString());
    return this.client.post<InventoryDto>(this.baseUrl, null, { params });
  }

  public updateStock(productId: number, quantity: number, isIncrement: boolean): Observable<InventoryDto> {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('quantity', quantity.toString())
      .set('isIncrement', isIncrement.toString());
    return this.client.post<InventoryDto>(`${this.baseUrl}/update-stock`, null, { params });
  }

  public setStock(productId: number, stock: number): Observable<InventoryDto> {
    const params = new HttpParams()
      .set('stock', stock.toString());
    return this.client.put<InventoryDto>(`${this.baseUrl}/${productId}`, null, { params });
  }

  public deleteInventory(productId: number): Observable<void> {
    return this.client.delete<void>(`${this.baseUrl}/${productId}`);
  }

  public getInventoriesByProductIds(productIds: number[]): Observable<InventoryDto[]> {
    return this.client.post<InventoryDto[]>(`${this.baseUrl}/products`, productIds);
  }
}