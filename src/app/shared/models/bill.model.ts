export type BillStatus = 'pending' | 'paid';

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
  paidAt: number | null;
  createdBy: string;
  createdAt: number;
}
