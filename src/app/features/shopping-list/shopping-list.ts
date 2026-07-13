import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';

import { ConfirmService } from '../../shared/confirm.service';
import { ShoppingItem } from '../../shared/models/shopping-item.model';
import {
  ShoppingItemEditDialog,
  ShoppingItemEditResult,
} from './shopping-item-edit-dialog';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './shopping-list.html',
  styleUrl: './shopping-list.css',
})
export class ShoppingList {
  protected readonly shoppingListService = inject(ShoppingListService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmService = inject(ConfirmService);

  protected readonly newName = signal('');
  protected readonly newQuantity = signal(1);

  async addItem() {
    const name = this.newName().trim();
    if (!name) return;

    const quantity = this.newQuantity() > 0 ? this.newQuantity() : 1;
    this.newName.set('');
    this.newQuantity.set(1);
    await this.shoppingListService.add(name, quantity);
  }

  async editItem(item: ShoppingItem) {
    const dialogRef = this.dialog.open(ShoppingItemEditDialog, { width: '360px', data: item });
    const result: ShoppingItemEditResult | undefined = await firstValueFrom(
      dialogRef.afterClosed(),
    );
    if (result) await this.shoppingListService.update(item, result.name, result.quantity);
  }

  async removeItem(item: ShoppingItem) {
    const confirmed = await this.confirmService.confirm({
      title: 'Excluir item',
      message: `Excluir "${item.name}" da lista?`,
    });
    if (confirmed) await this.shoppingListService.remove(item);
  }
}
