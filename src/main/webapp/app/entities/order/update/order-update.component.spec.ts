import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IEmployeeInformation } from 'app/entities/employee-information/employee-information.model';
import { EmployeeInformationService } from 'app/entities/employee-information/service/employee-information.service';
import { OrderService } from '../service/order.service';
import { IOrder } from '../order.model';
import { OrderFormService } from './order-form.service';

import { OrderUpdateComponent } from './order-update.component';

describe('Order Management Update Component', () => {
  let comp: OrderUpdateComponent;
  let fixture: ComponentFixture<OrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderFormService: OrderFormService;
  let orderService: OrderService;
  let employeeInformationService: EmployeeInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OrderUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderFormService = TestBed.inject(OrderFormService);
    orderService = TestBed.inject(OrderService);
    employeeInformationService = TestBed.inject(EmployeeInformationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call EmployeeInformation query and add missing value', () => {
      const order: IOrder = { id: 456 };
      const employeeInformation: IEmployeeInformation = { id: 2594 };
      order.employeeInformation = employeeInformation;

      const employeeInformationCollection: IEmployeeInformation[] = [{ id: 15845 }];
      jest.spyOn(employeeInformationService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeInformationCollection })));
      const additionalEmployeeInformations = [employeeInformation];
      const expectedCollection: IEmployeeInformation[] = [...additionalEmployeeInformations, ...employeeInformationCollection];
      jest.spyOn(employeeInformationService, 'addEmployeeInformationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(employeeInformationService.query).toHaveBeenCalled();
      expect(employeeInformationService.addEmployeeInformationToCollectionIfMissing).toHaveBeenCalledWith(
        employeeInformationCollection,
        ...additionalEmployeeInformations.map(expect.objectContaining),
      );
      expect(comp.employeeInformationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const order: IOrder = { id: 456 };
      const employeeInformation: IEmployeeInformation = { id: 11575 };
      order.employeeInformation = employeeInformation;

      activatedRoute.data = of({ order });
      comp.ngOnInit();

      expect(comp.employeeInformationsSharedCollection).toContain(employeeInformation);
      expect(comp.order).toEqual(order);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrder>>();
      const order = { id: 123 };
      jest.spyOn(orderFormService, 'getOrder').mockReturnValue(order);
      jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: order }));
      saveSubject.complete();

      // THEN
      expect(orderFormService.getOrder).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderService.update).toHaveBeenCalledWith(expect.objectContaining(order));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrder>>();
      const order = { id: 123 };
      jest.spyOn(orderFormService, 'getOrder').mockReturnValue({ id: null });
      jest.spyOn(orderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: order }));
      saveSubject.complete();

      // THEN
      expect(orderFormService.getOrder).toHaveBeenCalled();
      expect(orderService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrder>>();
      const order = { id: 123 };
      jest.spyOn(orderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ order });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEmployeeInformation', () => {
      it('Should forward to employeeInformationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(employeeInformationService, 'compareEmployeeInformation');
        comp.compareEmployeeInformation(entity, entity2);
        expect(employeeInformationService.compareEmployeeInformation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
