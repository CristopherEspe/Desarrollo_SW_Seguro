import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ProductDto } from '@app/models/product.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `${environment.api.urls.serviceProducts}/products`;

  constructor(private client: HttpClient) {}

  public getAll(): Observable<ProductDto[]> {
    return this.client.get<ProductDto[]>(this.baseUrl);
  }

  public getById(id: number): Observable<ProductDto> {
    return this.client.get<ProductDto>(`${this.baseUrl}/${id}`);
  }

  public create(product: ProductDto): Observable<ProductDto> {
    return this.client.post<ProductDto>(this.baseUrl, product);
  }

  public update(product: ProductDto): Observable<ProductDto> {
    return this.client.put<ProductDto>(`${this.baseUrl}/${product.id}`, product);
  }

  public delete(id: number): Observable<void> {
    return this.client.delete<void>(`${this.baseUrl}/${id}`);
  }

  public search(query: string): Observable<ProductDto[]> {
    const params = new HttpParams().set('query', query);
    return this.client.get<ProductDto[]>(`${this.baseUrl}/search`, { params });
  }

  public fetchByIds(ids: number[]): Observable<ProductDto[]> {
    return this.client.post<ProductDto[]>(`${this.baseUrl}/fetch-ids`, ids);
  }
}