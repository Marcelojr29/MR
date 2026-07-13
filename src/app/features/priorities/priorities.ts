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
import { TextEditDialog } from '../../shared/text-edit-dialog/text-edit-dialog';
import { Priority } from '../../shared/models/priority.model';
import { PrioritiesService } from './priorities.service';

@Component({
  selector: 'app-priorities',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './priorities.html',
  styleUrl: './priorities.css',
})
export class Priorities {
  protected readonly prioritiesService = inject(PrioritiesService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmService = inject(ConfirmService);

  protected readonly newTitle = signal('');

  async addPriority() {
    const title = this.newTitle().trim();
    if (!title) return;

    this.newTitle.set('');
    await this.prioritiesService.add(title);
  }

  async editPriority(priority: Priority) {
    const dialogRef = this.dialog.open(TextEditDialog, {
      width: '360px',
      data: { title: 'Editar prioridade', label: 'Título', value: priority.title },
    });
    const newTitle = await firstValueFrom(dialogRef.afterClosed());
    if (newTitle) await this.prioritiesService.update(priority, newTitle);
  }

  async removePriority(priority: Priority) {
    const confirmed = await this.confirmService.confirm({
      title: 'Excluir prioridade',
      message: `Excluir "${priority.title}"?`,
    });
    if (confirmed) await this.prioritiesService.remove(priority);
  }
}
