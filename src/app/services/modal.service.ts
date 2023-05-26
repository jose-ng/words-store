import {
  Injectable,
  ComponentRef,
  ViewContainerRef,
  Type,
} from '@angular/core';
import { ModalAnchorComponent } from '../shared/components/dynamic/modal-anchor/modal-anchor.component';
import { ModalComponent } from '../shared/components/modal/modal.component';
import { ModalOptions } from '../models/modal.model';
import ModalContentBaseComponent from '../models/modal.content.base';

@Injectable()
export class ModalService {
  private modalContainerRef: ComponentRef<ModalAnchorComponent> | null = null;
  private viewContainerRef!: ViewContainerRef;

  registerContainerRef(vcRef: ViewContainerRef) {
    this.viewContainerRef = vcRef;
  }

  openModal<T extends ModalContentBaseComponent>(
    component: Type<T>,
    options: ModalOptions
  ) {
    if (!this.modalContainerRef) {
      this.modalContainerRef =
        this.viewContainerRef.createComponent(ModalAnchorComponent);
      document.body.appendChild(this.modalContainerRef.location.nativeElement);
    }

    const modalComponent: ComponentRef<ModalComponent> =
      this.modalContainerRef.instance.viewContainerRef.createComponent(
        ModalComponent
      );

    modalComponent.instance.addComponent(component, this.closeModal.bind(this));
    modalComponent.instance.title = options.title;
    modalComponent.instance.type = options.type;
    modalComponent.instance.confirmButton = options.confirmButton;
    modalComponent.instance.reload();
  }

  closeModal() {
    if (this.modalContainerRef) {
      this.modalContainerRef.destroy();
      this.modalContainerRef = null;
    }
  }
}
