import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '../../core/auth.service';
import { ThemeService } from '../../core/theme.service';
import { LogoMark } from '../../shared/logo-mark/logo-mark';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    LogoMark,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly theme = inject(ThemeService);

  readonly navItems: NavItem[] = [
    { path: '/dashboard', icon: 'dashboard', label: 'Painel' },
    { path: '/tasks', icon: 'checklist', label: 'Afazeres' },
    { path: '/shopping-list', icon: 'shopping_cart', label: 'Compras' },
    { path: '/bills', icon: 'receipt_long', label: 'Contas' },
    { path: '/finance', icon: 'payments', label: 'Financeiro' },
  ];

  async logout() {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}
