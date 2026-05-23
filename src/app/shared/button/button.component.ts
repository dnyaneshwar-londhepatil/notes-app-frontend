import { Component, input, output } from '@angular/core';

type ButtonClassNames =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'default';

type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  public isLoading = input<boolean>(false);
  public variant = input<ButtonClassNames>('default');
  public size = input<ButtonSize>('md');
  public disabled = input<boolean>(false);
  public rounded = input<boolean>(false);
  public fullWidth = input<boolean>(false);
  public clicked = output<void>();
  public isActive = input<boolean>(false);

  get classes(): string[] {
    return [
      `button--${this.variant()}`,
      `button--${this.size()}`,
      this.rounded() ? 'button--rounded' : '',
      this.isLoading() ? 'button--loading' : '',
      this.fullWidth() ? 'button--full-width' : '',
      this.isActive() ? 'button--active' : '',
    ].filter(Boolean);
  }

  handleClick() {
    this.clicked.emit();
  }
}
