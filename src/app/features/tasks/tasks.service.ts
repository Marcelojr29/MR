import { Injectable, inject } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import { AuthService } from '../../core/auth.service';
import { safeWrite } from '../../core/firestore-write';
import { collectionSignal } from '../../core/firestore-collection';
import { firestore } from '../../core/firebase';
import { NotificationService } from '../../shared/notification.service';
import { Task } from '../../shared/models/task.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly tasksCollection = collection(firestore, 'tasks');

  readonly tasks = collectionSignal<Task>(this.tasksCollection, 'createdAt', 'desc');

  async add(title: string) {
    const uid = this.auth.user()?.uid;
    if (!uid) return;
    await safeWrite(
      this.notify,
      addDoc(this.tasksCollection, {
        title,
        done: false,
        createdBy: uid,
        createdAt: Date.now(),
      }),
    );
  }

  async update(task: Task, title: string) {
    await safeWrite(this.notify, updateDoc(doc(firestore, 'tasks', task.id), { title }));
  }

  async toggle(task: Task) {
    await safeWrite(
      this.notify,
      updateDoc(doc(firestore, 'tasks', task.id), { done: !task.done }),
    );
  }

  async remove(task: Task) {
    await safeWrite(this.notify, deleteDoc(doc(firestore, 'tasks', task.id)));
  }
}
