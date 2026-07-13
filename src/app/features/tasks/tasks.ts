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
import { Task } from '../../shared/models/task.model';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  protected readonly tasksService = inject(TasksService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmService = inject(ConfirmService);

  protected readonly newTitle = signal('');

  async addTask() {
    const title = this.newTitle().trim();
    if (!title) return;

    this.newTitle.set('');
    await this.tasksService.add(title);
  }

  async editTask(task: Task) {
    const dialogRef = this.dialog.open(TextEditDialog, {
      width: '360px',
      data: { title: 'Editar tarefa', label: 'Título', value: task.title },
    });
    const newTitle = await firstValueFrom(dialogRef.afterClosed());
    if (newTitle) await this.tasksService.update(task, newTitle);
  }

  async removeTask(task: Task) {
    const confirmed = await this.confirmService.confirm({
      title: 'Excluir tarefa',
      message: `Excluir "${task.title}"?`,
    });
    if (confirmed) await this.tasksService.remove(task);
  }
}
