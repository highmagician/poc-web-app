export type PaymentMethod = 'card' | 'promptpay' | 'transfer';

export interface WorkshopOrder {
  reference: string;
  createdAtIso: string;
  courseId: string;
  courseNameEn: string;
  courseNameTh: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  participants: number;
  notes: string;
  paymentMethod: PaymentMethod;
  totalThb: number;
}
