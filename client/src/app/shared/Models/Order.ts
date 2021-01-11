import { IAddress } from "./Address";

  export interface IOrderToCreate {
      basketId: string;
      deliveryMethodId: number;
      shiptoAddress: IAddress;
  }
  export interface IOrderItem {
    productId: number;
    productName: string;
    productUrl: string;
    price: number;
    quantity: number;
}

export interface IOrder {
    id: number;
    buyerEmail: string;
    orderDate: Date;
    shipToAddress: IAddress;
    deliveryMethod: string;
    shippingPrice: number;
    orderItems: IOrderItem[];
    subtotal: number;
    total: number;
    status: string;
}
