import { Directive, ElementRef, inject, input } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appMarkFormTouched]',
})
export class MarkFormTouchedDirective {
  public appMarkFormTouched = input.required<FormGroup>();

  public elementRef = inject<ElementRef<HTMLFormElement>>(ElementRef);

  constructor() {
    this.elementRef.nativeElement.addEventListener('submit', ($event) => {
      if (this.appMarkFormTouched().invalid) {
        $event.preventDefault();
        $event.stopPropagation();
        $event.stopImmediatePropagation();

        this.markAllControlsAsTouchedAndDirty(this.appMarkFormTouched());
      }
    });
  }

  protected markAllControlsAsTouchedAndDirty(
    abstractControl: AbstractControl,
  ): void {
    this.markControlAsTouchedAndDirty(abstractControl);

    if (abstractControl instanceof FormGroup) {
      for (const control of Object.values(abstractControl.controls)) {
        this.markAllControlsAsTouchedAndDirty(control);
      }
      return;
    }

    if (abstractControl instanceof FormArray) {
      for (const control of abstractControl.controls) {
        this.markAllControlsAsTouchedAndDirty(control);
      }
    }
  }

  protected markControlAsTouchedAndDirty(control: AbstractControl) {
    control.markAllAsTouched();
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();
  }
}
