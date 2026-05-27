import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiConfigService } from '../api-config/api-config.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
} from '../../interfaces/auth-response';
import { StorageService, StorageKeys } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiConfig = inject(ApiConfigService);

  private readonly route = inject(Router);

  private readonly storageService = inject(StorageService);

  private readonly http = inject(HttpClient);

  readonly error = signal<string | null>(null);

  readonly isLoading = signal(false);

  readonly hasError = computed(() => this.error() !== null);

  signUp(userData: SignUpRequest): Observable<SignUpResponse> {
    const url = this.apiConfig.url('api/auth/signup');
    return this.http.post<SignUpResponse>(url, userData).pipe(
      tap(() => this.error.set(null)),
      catchError(this.handleError.bind(this)),
      finalize(() => this.isLoading.set(false)),
    );
  }

  signIn(userData: SignInRequest): Observable<SignInResponse> {
    const url = this.apiConfig.url('api/auth/login');
    return this.http.post<SignInResponse>(url, userData).pipe(
      tap(() => this.error.set(null)),
      catchError(this.handleError.bind(this)),
      finalize(() => this.isLoading.set(false)),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.error?.message || 'An unknown error occurred';
    this.error.set(message);
    return throwError(() => error);
  }

  public logout(): void {
    this.storageService.removeKey(StorageKeys.AuthToken);
    this.route.navigate(['/account/register']);
  }
}
