import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IOrderAnItem } from '../order-an-item.model';

@Component({
  standalone: true,
  selector: 'jhi-order-an-item-detail',
  templateUrl: './order-an-item-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class OrderAnItemDetailComponent {
  orderAnItem = input<IOrderAnItem | null>(null);

  previousState(): void {
    window.history.back();
  }
}
