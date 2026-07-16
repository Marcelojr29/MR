export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  price: number | null;
  done: boolean;
  createdBy: string;
  createdAt: number;
}
