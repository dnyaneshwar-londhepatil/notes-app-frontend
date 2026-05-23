import { Component, signal } from '@angular/core';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthState } from '../../interfaces/auth-state';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [SignUpComponent, SignInComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  public AuthState = AuthState;
  public selectedState = signal<AuthState>(AuthState.SIGN_UP);

  public changeState(state: AuthState) {
    this.selectedState.set(state);
  }
}
