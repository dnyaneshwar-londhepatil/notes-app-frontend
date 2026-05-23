import { Injectable, inject, Type } from '@angular/core';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { ModalWrapperComponent } from '../../shared/modal-wrapper/modal-wrapper.component';

export interface ModalOptions<
  T = Record<string, unknown>,
> extends NgbModalOptions {
  data?: T;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly ngbModal = inject(NgbModal);

  // ✅ Track the currently open modal ref
  private activeModalRef: NgbModalRef | null = null;

  open<TComponent, TResult = unknown>(
    component: Type<TComponent>,
    options: ModalOptions = {},
  ) {
    const { data, ...ngbOptions } = options;

    this.activeModalRef = this.ngbModal.open(ModalWrapperComponent, {
      centered: true,
      ...ngbOptions,
    });

    const instance = this.activeModalRef
      .componentInstance as ModalWrapperComponent;
    instance.component.set(component);

    if (data) {
      instance.componentInputs.set(data);
    }

    // ✅ Clear ref when modal is dismissed or closed externally (e.g. backdrop click)
    this.activeModalRef.hidden.subscribe(() => {
      this.activeModalRef = null;
    });

    return this.activeModalRef as NgbModalRef & { result: Promise<TResult> };
  }

  /** Close with a result value (resolves `modalRef.result`) */
  close<TResult = unknown>(result?: TResult): void {
    this.activeModalRef?.close(result);
  }

  /** Dismiss with a reason (rejects `modalRef.result`) */
  dismiss(reason?: unknown): void {
    this.activeModalRef?.dismiss(reason);
  }

  closeModal(): void {
    this.activeModalRef?.dismiss();
    this.activeModalRef = null;
  }

  /** Close all open modals at once (e.g. on logout or route change) */
  closeAll(): void {
    this.ngbModal.dismissAll();
    this.activeModalRef = null;
  }
}
