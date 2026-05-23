import {
  Component,
  ViewContainerRef,
  viewChild,
  signal,
  Type,
  effect,
  inject,
  ComponentRef,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-wrapper',
  standalone: true,
  templateUrl: './modal-wrapper.component.html',
  styleUrls: ['./modal-wrapper.component.scss'],
})
export class ModalWrapperComponent {
  // ✅ Read ViewContainerRef directly — NOT ElementRef
  private readonly container = viewChild.required('container', {
    read: ViewContainerRef,
  });

  // ✅ Writable signals — can be set from ModalService
  public readonly component = signal<Type<any> | null>(null);
  public readonly componentInputs = signal<Record<string, unknown>>({});

  private readonly activeModal = inject(NgbActiveModal);
  private componentRef: ComponentRef<any> | null = null;

  constructor() {
    effect(() => {
      const comp = this.component();
      const inputs = this.componentInputs();

      if (!comp) return;

      const vcr = this.container();
      vcr.clear();

      this.componentRef = vcr.createComponent(comp);

      // ✅ Pass inputs into the dynamic component
      if (inputs) {
        Object.entries(inputs).forEach(([key, value]) => {
          this.componentRef!.setInput(key, value);
        });
      }

      this.componentRef.changeDetectorRef.detectChanges();
    });
  }

  close(result?: unknown) {
    this.activeModal.close(result);
  }

  dismiss(reason?: unknown) {
    this.activeModal.dismiss(reason);
  }
}
