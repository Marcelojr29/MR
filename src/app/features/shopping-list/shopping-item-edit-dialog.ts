import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ShoppingItem } from '../../shared/models/shopping-item.model';

export interface ShoppingItemEditResult {
  name: string;
  quantity: number;
  price: number | null;
}

@Component({
  selector: 'app-shopping-item-edit-dialog',
  imports: [FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Editar item</h2>
    <mat-dialog-content class="flex flex-col gap-2">
      <mat-form-field appearance="outline">
        <mat-label>Item</mat-label>
        <input matInput [(ngModel)]="name" name="name" />
      </mat-form-field>
      <div class="flex gap-2">
        <mat-form-field appearance="outline" class="flex-1">
          <mat-label>Quantidade</mat-label>
          <input matInput type="number" min="1" [(ngModel)]="quantity" name="quantity" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="flex-1">
          <mat-label>Valor un.</mat-label>
          <span matTextPrefix>R$&nbsp;</span>
          <input matInput type="number" min="0" step="0.01" [(ngModel)]="price" name="price" />
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="!name().trim()" (click)="save()">
        Salvar
      </button>
    </mat-dialog-actions>
  `,
})
export class ShoppingItemEditDialog {
  private readonly data = inject<ShoppingItem>(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef<ShoppingItemEditDialog>);

  protected readonly name = signal(this.data.name);
  protected readonly quantity = signal(this.data.quantity);
  protected readonly price = signal<number | null>(this.data.price);

  save() {
    const name = this.name().trim();
    if (!name) return;
    const quantity = this.quantity() > 0 ? this.quantity() : 1;
    const price = this.price();
    this.dialogRef.close({
      name,
      quantity,
      price: price && price > 0 ? price : null,
    } satisfies ShoppingItemEditResult);
  }
}
