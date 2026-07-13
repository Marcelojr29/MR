import { Injectable, inject } from '@angular/core';
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

  async add(name: string, quantity: number) {
    const uid = this.auth.user()?.uid;
    if (!uid) return;
    await safeWrite(
      this.notify,
      addDoc(this.itemsCollection, {
        name,
        quantity,
        done: false,
        createdBy: uid,
        createdAt: Date.now(),
      }),
    );
  }

  async update(item: ShoppingItem, name: string, quantity: number) {
    await safeWrite(
      this.notify,
      updateDoc(doc(firestore, 'shoppingList', item.id), { name, quantity }),
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
}
