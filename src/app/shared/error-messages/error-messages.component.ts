import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ɵEmptyOutletComponent } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, startWith, switchMap } from 'rxjs';

export enum ErrorKeys {
  Required = 'required',
  Email = 'email',
  Confirm = 'confirm',
  OldPasswordMismatch = 'oldPasswordMismatch',
  ServerValidation = 'serverValidation',
}

type CustomMapping = { [key: string]: string };

@Component({
  selector: 'app-error-messages',
  imports: [ɵEmptyOutletComponent],
  templateUrl: './error-messages.component.html',
  styleUrl: './error-messages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ErrorMessagesComponent {
  public control = input.required<AbstractControl>();

  public errorKeyMapping = input<CustomMapping>({});

  public forKeys = input<string[]>([]);

  public controlErrors = toSignal(
    toObservable(this.control)
      .pipe(
        switchMap((control) =>
          combineLatest([control.valueChanges, control.events]).pipe(
            startWith([undefined, undefined]),
          ),
        ),
      )
      .pipe(
        map(() =>
          this.control().errors ? { ...this.control().errors } : null,
        ),
      ),
    {
      initialValue: null,
    },
  );

  public showError = computed(() => {
    const hasErrors = this.allErrors().length > 0;

    if (!hasErrors) {
      return false;
    }

    // Only after blur or explicit markAsTouched (e.g. submit) — not on first keystroke.
    return this.control().touched;
  });

  public allErrors = computed<string[]>(() => {
    const controlErrors = this.controlErrors();
    const errorKeyMapping = this.errorKeyMapping();
    const forKeys = this.forKeys();

    if (!controlErrors) {
      return [];
    }

    const errors: string[] = [];

    for (const [errorKey, errorValue] of Object.entries(controlErrors)) {
      if (forKeys.length > 0 && !forKeys.includes(errorKey)) {
        continue;
      }

      switch (errorKey) {
        case ErrorKeys.Required:
          errors.push(
            this.getCustomMappingValue(
              errorKeyMapping,
              ErrorKeys.Required,
              'error_messages.required',
            ),
          );
          break;
        case ErrorKeys.Email:
          errors.push(
            this.getCustomMappingValue(
              errorKeyMapping,
              ErrorKeys.Email,
              'error_messages.email',
            ),
          );
          break;
        case ErrorKeys.Confirm:
          errors.push(
            this.getCustomMappingValue(
              errorKeyMapping,
              ErrorKeys.Confirm,
              'error_messages.confirm',
            ),
          );
          break;
        default:
          errors.push(
            typeof errorValue === 'string'
              ? errorValue
              : this.getCustomMappingValue(
                  errorKeyMapping,
                  errorKey,
                  'error_messages.invalid',
                ),
          );
      }
    }

    return errors;
  });

  public firstErrorMessage = computed(() => {
    const allErrors = this.allErrors();
    return allErrors.length > 0 ? allErrors[0] : '';
  });

  protected getCustomMappingValue(
    customMappings: CustomMapping,
    key: string,
    defaultValue: string,
  ): string {
    return key in customMappings ? customMappings[key] : defaultValue;
  }
}
