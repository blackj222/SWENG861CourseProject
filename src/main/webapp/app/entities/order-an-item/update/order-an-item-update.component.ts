import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { IOrderAnItem } from '../order-an-item.model';
import { OrderAnItemService } from '../service/order-an-item.service';
import { OrderAnItemFormService, OrderAnItemFormGroup } from './order-an-item-form.service';

import { IItem } from '../../item/item.model';
import { ItemService } from '../../item/service/item.service';
import { ItemFormService, ItemFormGroup } from '../../item/update/item-form.service';

@Component({
  standalone: true,
  selector: 'jhi-order-an-item-update',
  templateUrl: './order-an-item-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OrderAnItemUpdateComponent implements OnInit {
  isSaving = false;
  orderAnItem: IOrderAnItem | null = null;

  ordersSharedCollection: IOrder[] = [];

  protected orderAnItemService = inject(OrderAnItemService);
  protected orderAnItemFormService = inject(OrderAnItemFormService);
  protected orderService = inject(OrderService);
  protected activatedRoute = inject(ActivatedRoute);

  Item: IItem | null = null;

  protected ItemService = inject(ItemService);
  protected ItemFormService = inject(ItemFormService);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OrderAnItemFormGroup = this.orderAnItemFormService.createOrderAnItemFormGroup();

  compareOrder = (o1: IOrder | null, o2: IOrder | null): boolean => this.orderService.compareOrder(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderAnItem }) => {
      this.orderAnItem = orderAnItem;
      if (orderAnItem) {
        this.updateForm(orderAnItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const Item = this.ItemFormService.getNewItem(this.editForm);
    this.subscribeToSaveResponse(this.ItemService.create(Item));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(orderAnItem: IOrderAnItem): void {
    this.orderAnItem = orderAnItem;
    this.orderAnItemFormService.resetForm(this.editForm, orderAnItem);

    this.ordersSharedCollection = this.orderService.addOrderToCollectionIfMissing<IOrder>(this.ordersSharedCollection, orderAnItem.order);
  }

  protected loadRelationshipsOptions(): void {
    this.orderService
      .query()
      .pipe(map((res: HttpResponse<IOrder[]>) => res.body ?? []))
      .pipe(map((orders: IOrder[]) => this.orderService.addOrderToCollectionIfMissing<IOrder>(orders, this.orderAnItem?.order)))
      .subscribe((orders: IOrder[]) => (this.ordersSharedCollection = orders));
  }
}
