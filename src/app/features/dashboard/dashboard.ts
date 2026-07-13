import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { BillsService } from '../bills/bills.service';
import { FinanceService } from '../finance/finance.service';
import { PrioritiesService } from '../priorities/priorities.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { TasksService } from '../tasks/tasks.service';
import { formatCurrency } from '../../shared/currency';

interface Kpi {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly tasksService = inject(TasksService);
  private readonly shoppingListService = inject(ShoppingListService);
  private readonly billsService = inject(BillsService);
  private readonly financeService = inject(FinanceService);
  private readonly prioritiesService = inject(PrioritiesService);

  private readonly pendingTasks = computed(
    () => this.tasksService.tasks().filter((task) => !task.done).length,
  );

  private readonly pendingShoppingItems = computed(
    () => this.shoppingListService.items().filter((item) => !item.done).length,
  );

  private readonly totalPaidThisMonth = computed(() => {
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return this.billsService
      .paid()
      .filter((bill) => bill.paidAt && new Date(bill.paidAt).toISOString().startsWith(monthPrefix))
      .reduce((sum, bill) => sum + bill.amount, 0);
  });

  private readonly totalPending = computed(() =>
    this.billsService.pending().reduce((sum, bill) => sum + bill.amount, 0),
  );

  private readonly pendingPriorities = computed(
    () => this.prioritiesService.priorities().filter((priority) => !priority.done).length,
  );

  protected readonly kpis = computed<Kpi[]>(() => [
    {
      label: 'Afazeres pendentes',
      value: this.pendingTasks(),
      icon: 'checklist',
      color: '#7c4dff',
    },
    {
      label: 'Lista de compras',
      value: this.pendingShoppingItems(),
      icon: 'shopping_cart',
      color: '#22d3ee',
    },
    {
      label: 'Contas a pagar',
      value: formatCurrency(this.totalPending()),
      icon: 'receipt_long',
      color: '#f59e0b',
    },
    {
      label: 'Contas pagas (mês)',
      value: formatCurrency(this.totalPaidThisMonth()),
      icon: 'task_alt',
      color: '#10b981',
    },
    {
      label: 'Recebido no mês',
      value: formatCurrency(this.financeService.totalIncomeThisMonth()),
      icon: 'trending_up',
      color: '#10b981',
    },
    {
      label: 'Debitado no mês',
      value: formatCurrency(this.financeService.totalExpenseThisMonth()),
      icon: 'trending_down',
      color: '#f43f5e',
    },
    {
      label: 'Prioridades',
      value: this.pendingPriorities(),
      icon: 'flag',
      color: '#d946ef',
    },
  ]);
}
