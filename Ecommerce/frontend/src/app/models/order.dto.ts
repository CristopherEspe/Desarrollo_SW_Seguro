export interface OrderDto {
  id: number;
  userId: string;
  items: OrderItemDto[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  shippingMethod: string;
  trackingNumber: string;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}
