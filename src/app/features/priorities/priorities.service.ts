import { Injectable, inject } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import { AuthService } from '../../core/auth.service';
import { safeWrite } from '../../core/firestore-write';
import { collectionSignal } from '../../core/firestore-collection';
import { firestore } from '../../core/firebase';
import { NotificationService } from '../../shared/notification.service';
import { Priority } from '../../shared/models/priority.model';

@Injectable({ providedIn: 'root' })
export class PrioritiesService {
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly prioritiesCollection = collection(firestore, 'priorities');

  readonly priorities = collectionSignal<Priority>(this.prioritiesCollection, 'createdAt', 'asc');

  async add(title: string) {
    const uid = this.auth.user()?.uid;
    if (!uid) return;
    await safeWrite(
      this.notify,
      addDoc(this.prioritiesCollection, {
        title,
        done: false,
        createdBy: uid,
        createdAt: Date.now(),
      }),
    );
  }

  async update(priority: Priority, title: string) {
    await safeWrite(this.notify, updateDoc(doc(firestore, 'priorities', priority.id), { title }));
  }

  async toggle(priority: Priority) {
    await safeWrite(
      this.notify,
      updateDoc(doc(firestore, 'priorities', priority.id), { done: !priority.done }),
    );
  }

  async remove(priority: Priority) {
    await safeWrite(this.notify, deleteDoc(doc(firestore, 'priorities', priority.id)));
  }
}
