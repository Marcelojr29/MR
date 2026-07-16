import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';

import { ConfirmService } from '../../shared/confirm.service';
import { formatCurrency } from '../../shared/currency';
import { todayIso } from '../../shared/date';
import { ShoppingItem } from '../../shared/models/shopping-item.model';
import { FinanceService } from '../finance/finance.service';
import {
  ShoppingItemEditDialog,
  ShoppingItemEditResult,
} from './shopping-item-edit-dialog';
import { ShoppingListService } from './shopping-list.service';

const PURCHASE_DESCRIPTION = 'Compras do Mês';

@Component({
  selector: 'app-shopping-list',
  imports: [
    CurrencyPipe,
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
  private readonly financeService = inject(FinanceService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmService = inject(ConfirmService);

  protected readonly shoppingMode = signal(false);

  protected readonly newName = signal('');
  protected readonly newQuantity = signal(1);
  protected readonly newPrice = signal<number | null>(null);

  toggleShoppingMode() {
    this.shoppingMode.update((value) => !value);
  }

  async addItem() {
    const name = this.newName().trim();
    if (!name) return;

    const quantity = this.newQuantity() > 0 ? this.newQuantity() : 1;
    const price = this.newPrice();
    this.newName.set('');
    this.newQuantity.set(1);
    this.newPrice.set(null);
    await this.shoppingListService.add(name, quantity, price && price > 0 ? price : null);
  }

  async editItem(item: ShoppingItem) {
    const dialogRef = this.dialog.open(ShoppingItemEditDialog, { width: '360px', data: item });
    const result: ShoppingItemEditResult | undefined = await firstValueFrom(
      dialogRef.afterClosed(),
    );
    if (result) {
      await this.shoppingListService.update(item, result.name, result.quantity, result.price);
    }
  }

  async removeItem(item: ShoppingItem) {
    const confirmed = await this.confirmService.confirm({
      title: 'Excluir item',
      message: `Excluir "${item.name}" da lista?`,
    });
    if (confirmed) await this.shoppingListService.remove(item);
  }

  async finalizePurchase() {
    const total = this.shoppingListService.purchasedTotal();
    if (total <= 0) return;

    const confirmed = await this.confirmService.confirm({
      title: 'Finalizar compras',
      message: `Lançar ${formatCurrency(total)} como "${PURCHASE_DESCRIPTION}" no Financeiro e remover os itens comprados da lista?`,
      confirmLabel: 'Finalizar',
    });
    if (!confirmed) return;

    await this.financeService.add('expense', total, PURCHASE_DESCRIPTION, todayIso());
    await this.shoppingListService.removePurchased();
    this.shoppingMode.set(false);
  }
}
