import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IOrderAnItem } from '../order-an-item.model';
import { OrderAnItemService } from '../service/order-an-item.service';

@Component({
  standalone: true,
  templateUrl: './order-an-item-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class OrderAnItemDeleteDialogComponent {
  orderAnItem?: IOrderAnItem;

  protected orderAnItemService = inject(OrderAnItemService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.orderAnItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
