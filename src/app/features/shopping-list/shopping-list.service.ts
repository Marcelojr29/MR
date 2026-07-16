import { Injectable, computed, inject } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import { AuthService } from '../../core/auth.service';
import { safeWrite } from '../../core/firestore-write';
import { collectionSignal } from '../../core/firestore-collection';
import { firestore } from '../../core/firebase';
import { NotificationService } from '../../shared/notification.service';
import { ShoppingItem } from '../../shared/models/shopping-item.model';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly itemsCollection = collection(firestore, 'shoppingList');

  readonly items = collectionSignal<ShoppingItem>(this.itemsCollection, 'createdAt', 'desc');

  readonly purchasedTotal = computed(() =>
    this.items()
      .filter((item) => item.done)
      .reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0),
  );

  async add(name: string, quantity: number, price: number | null) {
    const uid = this.auth.user()?.uid;
    if (!uid) return;
    await safeWrite(
      this.notify,
      addDoc(this.itemsCollection, {
        name,
        quantity,
        price,
        done: false,
        createdBy: uid,
        createdAt: Date.now(),
      }),
    );
  }

  async update(item: ShoppingItem, name: string, quantity: number, price: number | null) {
    await safeWrite(
      this.notify,
      updateDoc(doc(firestore, 'shoppingList', item.id), { name, quantity, price }),
    );
  }

  async toggle(item: ShoppingItem) {
    await safeWrite(
      this.notify,
      updateDoc(doc(firestore, 'shoppingList', item.id), { done: !item.done }),
    );
  }

  async remove(item: ShoppingItem) {
    await safeWrite(this.notify, deleteDoc(doc(firestore, 'shoppingList', item.id)));
  }

  /** Remove os itens marcados como comprados (usado ao finalizar uma compra). */
  async removePurchased() {
    const purchased = this.items().filter((item) => item.done);
    if (purchased.length === 0) return;
    await safeWrite(
      this.notify,
      Promise.all(
        purchased.map((item) => deleteDoc(doc(firestore, 'shoppingList', item.id))),
      ).then(() => undefined),
    );
  }
}
