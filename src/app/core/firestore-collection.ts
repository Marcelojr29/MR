import { Signal, signal } from '@angular/core';
import { CollectionReference, onSnapshot, orderBy, query } from 'firebase/firestore';

export function collectionSignal<T>(
  collectionRef: CollectionReference,
  orderByField: string,
  direction: 'asc' | 'desc' = 'desc',
): Signal<T[]> {
  const state = signal<T[]>([]);
  const itemsQuery = query(collectionRef, orderBy(orderByField, direction));

  onSnapshot(itemsQuery, (snapshot) => {
    state.set(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T));
  });

  return state.asReadonly();
}
