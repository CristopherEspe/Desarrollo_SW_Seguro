export interface UserDto {
    keycloakId: string;
    email: string;
    cartItems: CartItemDto[];
    cartSubtotal: number;
  }
  
  export interface CartItemDto {
    productId: number;
    quantity: number;
    unitPrice: number;
  }