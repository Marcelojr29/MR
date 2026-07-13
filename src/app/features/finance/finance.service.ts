import { Injectable, computed, inject } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import { AuthService } from '../../core/auth.service';
import { safeWrite } from '../../core/firestore-write';
import { collectionSignal } from '../../core/firestore-collection';
import { firestore } from '../../core/firebase';
import { NotificationService } from '../../shared/notification.service';
import { Transaction, TransactionType } from '../../shared/models/transaction.model';

function isCurrentMonth(dateIso: string): boolean {
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return dateIso.startsWith(monthPrefix);
}

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly transactionsCollection = collection(firestore, 'transactions');

  readonly transactions = collectionSignal<Transaction>(
    this.transactionsCollection,
    'date',
    'desc',
  );

  readonly totalIncomeThisMonth = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'income' && isCurrentMonth(t.date))
      .reduce((sum, t) => sum + t.amount, 0),
  );

  readonly totalExpenseThisMonth = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'expense' && isCurrentMonth(t.date))
      .reduce((sum, t) => sum + t.amount, 0),
  );

  async add(type: TransactionType, amount: number, description: string, date: string) {
    const uid = this.auth.user()?.uid;
    if (!uid) return;
    await safeWrite(
      this.notify,
      addDoc(this.transactionsCollection, {
        type,
        amount,
        description,
        date,
        createdBy: uid,
        createdAt: Date.now(),
      }),
    );
  }

  async update(
    transaction: Transaction,
    type: TransactionType,
    amount: number,
    description: string,
    date: string,
  ) {
    await safeWrite(
      this.notify,
      updateDoc(doc(firestore, 'transactions', transaction.id), { type, amount, description, date }),
    );
  }

  async remove(transaction: Transaction) {
    await safeWrite(this.notify, deleteDoc(doc(firestore, 'transactions', transaction.id)));
  }
}
