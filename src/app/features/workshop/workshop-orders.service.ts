import { Injectable, signal } from '@angular/core';
import { WorkshopOrder } from './workshop-order';

const ORDERS_STORAGE_KEY = 'poc-web-app.workshop-orders';

function readStoredOrders(): WorkshopOrder[] {
  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class WorkshopOrdersService {
  private readonly _orders = signal<WorkshopOrder[]>(readStoredOrders());
  readonly orders = this._orders.asReadonly();

  addOrder(order: WorkshopOrder): void {
    const orders = [order, ...this._orders()];
    this._orders.set(orders);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }

  removeOrder(reference: string): void {
    const orders = this._orders().filter((order) => order.reference !== reference);
    this._orders.set(orders);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }
}
