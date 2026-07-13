import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Transaction, TransactionType } from '../../shared/models/transaction.model';

export interface TransactionEditResult {
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
}

@Component({
  selector: 'app-transaction-edit-dialog',
  imports: [
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>Editar lançamento</h2>
    <mat-dialog-content class="flex flex-col gap-2">
      <mat-button-toggle-group [(ngModel)]="type" name="type" class="self-start">
        <mat-button-toggle value="income">Recebido</mat-button-toggle>
        <mat-button-toggle value="expense">Debitado</mat-button-toggle>
      </mat-button-toggle-group>
      <mat-form-field appearance="outline">
        <mat-label>Descrição</mat-label>
        <input matInput [(ngModel)]="description" name="description" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Valor</mat-label>
        <span matTextPrefix>R$&nbsp;</span>
        <input matInput type="number" min="0" step="0.01" [(ngModel)]="amount" name="amount" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Data</mat-label>
        <input matInput type="date" [(ngModel)]="date" name="date" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button
        mat-flat-button
        color="primary"
        [disabled]="!description().trim() || !amount()"
        (click)="save()"
      >
        Salvar
      </button>
    </mat-dialog-actions>
  `,
})
export class TransactionEditDialog {
  private readonly data = inject<Transaction>(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef<TransactionEditDialog>);

  protected readonly type = signal<TransactionType>(this.data.type);
  protected readonly amount = signal<number | null>(this.data.amount);
  protected readonly description = signal(this.data.description);
  protected readonly date = signal(this.data.date);

  save() {
    const description = this.description().trim();
    const amount = this.amount();
    if (!description || !amount || amount <= 0) return;
    this.dialogRef.close({
      type: this.type(),
      amount,
      description,
      date: this.date(),
    } satisfies TransactionEditResult);
  }
}
