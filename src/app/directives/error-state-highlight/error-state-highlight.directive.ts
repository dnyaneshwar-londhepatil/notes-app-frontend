import { Directive, input, inject, ElementRef, effect } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, map, startWith } from 'rxjs/operators';
import { merge } from 'rxjs';

@Directive({
  selector: '[appErrorStateHighlight]',
})
export class ErrorStateHighlightDirective {
  public errorStateControl = input.required<AbstractControl>();

  public errorStateClass = input('border-danger');

  public elementRef =
    inject<
      ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    >(ElementRef);

  // This code converts Angular Reactive Form state into a Signal so your template/computed values react automatically when the form control changes.
  protected controlState = toSignal(
    toObservable(this.errorStateControl).pipe(
      switchMap((control) =>
        merge(
          control.statusChanges.pipe(startWith(control.status)),
          control.valueChanges,
          control.events,
        ).pipe(
          map(() => ({
            valid: control.valid,
            touched: control.touched,
            dirty: control.dirty,
            pristine: control.pristine,
          })),
        ),
      ),
    ),
    {
      initialValue: {
        valid: true,
        touched: false,
        dirty: false,
        pristine: true,
      },
    },
  );

  constructor() {
    effect(() => {
      // Trigger the effect when control state changes (via signal)
      // but read the actual control state directly for accuracy
      this.controlState(); // This ensures the effect re-runs on state changes
      const control = this.errorStateControl();
      const isValid = control.valid;

      this.elementRef.nativeElement.classList.remove(this.errorStateClass());

      // Only highlight if invalid after blur (touched) or submit — not while typing.
      if (!isValid && control.touched) {
        this.elementRef.nativeElement.classList.add(this.errorStateClass());
      }
    });
  }
}
