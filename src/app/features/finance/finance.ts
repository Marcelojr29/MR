import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';

import { ConfirmService } from '../../shared/confirm.service';
import { Transaction, TransactionType } from '../../shared/models/transaction.model';
import { FinanceService } from './finance.service';
import { TransactionEditDialog, TransactionEditResult } from './transaction-edit-dialog';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-finance',
  imports: [
    CurrencyPipe,
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './finance.html',
  styleUrl: './finance.css',
})
export class Finance {
  protected readonly financeService = inject(FinanceService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmService = inject(ConfirmService);

  protected readonly newType = signal<TransactionType>('income');
  protected readonly newAmount = signal<number | null>(null);
  protected readonly newDescription = signal('');
  protected readonly newDate = signal(todayIso());

  protected readonly balanceThisMonth = computed(
    () => this.financeService.totalIncomeThisMonth() - this.financeService.totalExpenseThisMonth(),
  );

  async addTransaction() {
    const amount = this.newAmount();
    const description = this.newDescription().trim();
    if (!amount || amount <= 0 || !description) return;

    this.newAmount.set(null);
    this.newDescription.set('');
    await this.financeService.add(this.newType(), amount, description, this.newDate());
  }

  async editTransaction(transaction: Transaction) {
    const dialogRef = this.dialog.open(TransactionEditDialog, {
      width: '360px',
      data: transaction,
    });
    const result: TransactionEditResult | undefined = await firstValueFrom(
      dialogRef.afterClosed(),
    );
    if (result) {
      await this.financeService.update(
        transaction,
        result.type,
        result.amount,
        result.description,
        result.date,
      );
    }
  }

  async removeTransaction(transaction: Transaction) {
    const confirmed = await this.confirmService.confirm({
      title: 'Excluir lançamento',
      message: `Excluir "${transaction.description}"?`,
    });
    if (confirmed) await this.financeService.remove(transaction);
  }
}
