import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { firstValueFrom } from 'rxjs';

import { ConfirmService } from '../../shared/confirm.service';
import { todayIso } from '../../shared/date';
import { Bill } from '../../shared/models/bill.model';
import { BillEditDialog, BillEditResult } from './bill-edit-dialog';
import { BillsService } from './bills.service';

@Component({
  selector: 'app-bills',
  imports: [
    CurrencyPipe,
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
  ],
  templateUrl: './bills.html',
  styleUrl: './bills.css',
})
export class Bills {
  protected readonly billsService = inject(BillsService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmService = inject(ConfirmService);

  protected readonly newTitle = signal('');
  protected readonly newAmount = signal<number | null>(null);
  protected readonly newDueDate = signal(todayIso());

  async addBill() {
    const title = this.newTitle().trim();
    const amount = this.newAmount();
    if (!title || !amount || amount <= 0) return;

    this.newTitle.set('');
    this.newAmount.set(null);
    await this.billsService.add(title, amount, this.newDueDate());
  }

  async editBill(bill: Bill) {
    const dialogRef = this.dialog.open(BillEditDialog, { width: '360px', data: bill });
    const result: BillEditResult | undefined = await firstValueFrom(dialogRef.afterClosed());
    if (result) await this.billsService.update(bill, result.title, result.amount, result.dueDate);
  }

  async removeBill(bill: Bill) {
    const confirmed = await this.confirmService.confirm({
      title: 'Excluir conta',
      message: `Excluir "${bill.title}"?`,
    });
    if (confirmed) await this.billsService.remove(bill);
  }
}
