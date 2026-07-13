import { Injectable, computed, inject } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import { AuthService } from '../../core/auth.service';
import { safeWrite } from '../../core/firestore-write';
import { collectionSignal } from '../../core/firestore-collection';
import { firestore } from '../../core/firebase';
import { NotificationService } from '../../shared/notification.service';
import { Bill } from '../../shared/models/bill.model';

@Injectable({ providedIn: 'root' })
export class BillsService {
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly billsCollection = collection(firestore, 'bills');

  readonly bills = collectionSignal<Bill>(this.billsCollection, 'dueDate', 'asc');

  readonly pending = computed(() => this.bills().filter((bill) => bill.status === 'pending'));
  readonly paid = computed(() => this.bills().filter((bill) => bill.status === 'paid'));

  async add(title: string, amount: number, dueDate: string) {
    const uid = this.auth.user()?.uid;
    if (!uid) return;
    await safeWrite(
      this.notify,
      addDoc(this.billsCollection, {
        title,
        amount,
        dueDate,
        status: 'pending',
        paidAt: null,
        createdBy: uid,
        createdAt: Date.now(),
      }),
    );
  }

  async update(bill: Bill, title: string, amount: number, dueDate: string) {
    await safeWrite(
      this.notify,
      updateDoc(doc(firestore, 'bills', bill.id), { title, amount, dueDate }),
    );
  }

  async markPaid(bill: Bill) {
    await safeWrite(
      this.notify,
      updateDoc(doc(firestore, 'bills', bill.id), { status: 'paid', paidAt: Date.now() }),
    );
  }

  async markPending(bill: Bill) {
    await safeWrite(
      this.notify,
      updateDoc(doc(firestore, 'bills', bill.id), { status: 'pending', paidAt: null }),
    );
  }

  async remove(bill: Bill) {
    await safeWrite(this.notify, deleteDoc(doc(firestore, 'bills', bill.id)));
  }
}
