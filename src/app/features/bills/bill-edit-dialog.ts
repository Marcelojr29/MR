import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Bill } from '../../shared/models/bill.model';

export interface BillEditResult {
  title: string;
  amount: number;
  dueDate: string;
}

@Component({
  selector: 'app-bill-edit-dialog',
  imports: [FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Editar conta</h2>
    <mat-dialog-content class="flex flex-col gap-2">
      <mat-form-field appearance="outline">
        <mat-label>Descrição</mat-label>
        <input matInput [(ngModel)]="title" name="title" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Valor</mat-label>
        <span matTextPrefix>R$&nbsp;</span>
        <input matInput type="number" min="0" step="0.01" [(ngModel)]="amount" name="amount" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Vencimento</mat-label>
        <input matInput type="date" [(ngModel)]="dueDate" name="dueDate" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="!title().trim() || !amount()" (click)="save()">
        Salvar
      </button>
    </mat-dialog-actions>
  `,
})
export class BillEditDialog {
  private readonly data = inject<Bill>(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef<BillEditDialog>);

  protected readonly title = signal(this.data.title);
  protected readonly amount = signal<number | null>(this.data.amount);
  protected readonly dueDate = signal(this.data.dueDate);

  save() {
    const title = this.title().trim();
    const amount = this.amount();
    if (!title || !amount || amount <= 0) return;
    this.dialogRef.close({ title, amount, dueDate: this.dueDate() } satisfies BillEditResult);
  }
}
