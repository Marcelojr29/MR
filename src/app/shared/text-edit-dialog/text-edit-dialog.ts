import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface TextEditDialogData {
  title: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-text-edit-dialog',
  imports: [FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>{{ data.label }}</mat-label>
        <input matInput [(ngModel)]="value" name="value" (keydown.enter)="save()" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="!value().trim()" (click)="save()">
        Salvar
      </button>
    </mat-dialog-actions>
  `,
})
export class TextEditDialog {
  protected readonly data = inject<TextEditDialogData>(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef<TextEditDialog>);
  protected readonly value = signal(this.data.value);

  save() {
    const trimmed = this.value().trim();
    if (!trimmed) return;
    this.dialogRef.close(trimmed);
  }
}
