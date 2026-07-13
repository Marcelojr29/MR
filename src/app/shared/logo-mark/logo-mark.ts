import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo-mark',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient [attr.id]="gradientId" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#7c4dff" />
          <stop offset="1" stop-color="#22d3ee" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" [attr.fill]="'url(#' + gradientId + ')'" />
      <path d="M24 11 L37 22.5 V36 H28 V27 H20 V36 H11 V22.5 Z" fill="white" fill-opacity="0.95" />
      <circle cx="24" cy="11" r="2.6" fill="white" />
    </svg>
  `,
})
export class LogoMark {
  readonly size = input(32);
  protected readonly gradientId = `nc-logo-gradient-${Math.random().toString(36).slice(2)}`;
}
