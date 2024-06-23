import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IEmployeeInformation } from 'app/entities/employee-information/employee-information.model';
import { EmployeeInformationService } from 'app/entities/employee-information/service/employee-information.service';
import { OrderService } from '../service/order.service';
import { IOrder } from '../order.model';
import { OrderFormService, OrderFormGroup } from './order-form.service';

@Component({
  standalone: true,
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;
  order: IOrder | null = null;

  employeeInformationsSharedCollection: IEmployeeInformation[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected orderService = inject(OrderService);
  protected orderFormService = inject(OrderFormService);
  protected employeeInformationService = inject(EmployeeInformationService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OrderFormGroup = this.orderFormService.createOrderFormGroup();

  compareEmployeeInformation = (o1: IEmployeeInformation | null, o2: IEmployeeInformation | null): boolean =>
    this.employeeInformationService.compareEmployeeInformation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
      if (order) {
        this.updateForm(order);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('sweng861CourseProjectApp.error', { ...err, key: 'error.file.' + err.key }),
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const order = this.orderFormService.getOrder(this.editForm);
    if (order.id !== null) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
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

  protected updateForm(order: IOrder): void {
    this.order = order;
    this.orderFormService.resetForm(this.editForm, order);

    this.employeeInformationsSharedCollection =
      this.employeeInformationService.addEmployeeInformationToCollectionIfMissing<IEmployeeInformation>(
        this.employeeInformationsSharedCollection,
        order.employeeInformation,
      );
  }

  protected loadRelationshipsOptions(): void {
    this.employeeInformationService
      .query()
      .pipe(map((res: HttpResponse<IEmployeeInformation[]>) => res.body ?? []))
      .pipe(
        map((employeeInformations: IEmployeeInformation[]) =>
          this.employeeInformationService.addEmployeeInformationToCollectionIfMissing<IEmployeeInformation>(
            employeeInformations,
            this.order?.employeeInformation,
          ),
        ),
      )
      .subscribe((employeeInformations: IEmployeeInformation[]) => (this.employeeInformationsSharedCollection = employeeInformations));
  }
}
