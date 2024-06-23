import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { OrderAnItemService } from '../service/order-an-item.service';
import { IOrderAnItem } from '../order-an-item.model';
import { OrderAnItemFormService } from './order-an-item-form.service';

import { OrderAnItemUpdateComponent } from './order-an-item-update.component';

describe('OrderAnItem Management Update Component', () => {
  let comp: OrderAnItemUpdateComponent;
  let fixture: ComponentFixture<OrderAnItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderAnItemFormService: OrderAnItemFormService;
  let orderAnItemService: OrderAnItemService;
  let orderService: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OrderAnItemUpdateComponent],
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
      .overrideTemplate(OrderAnItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderAnItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderAnItemFormService = TestBed.inject(OrderAnItemFormService);
    orderAnItemService = TestBed.inject(OrderAnItemService);
    orderService = TestBed.inject(OrderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Order query and add missing value', () => {
      const orderAnItem: IOrderAnItem = { id: 456 };
      const order: IOrder = { id: 1038 };
      orderAnItem.order = order;

      const orderCollection: IOrder[] = [{ id: 13314 }];
      jest.spyOn(orderService, 'query').mockReturnValue(of(new HttpResponse({ body: orderCollection })));
      const additionalOrders = [order];
      const expectedCollection: IOrder[] = [...additionalOrders, ...orderCollection];
      jest.spyOn(orderService, 'addOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orderAnItem });
      comp.ngOnInit();

      expect(orderService.query).toHaveBeenCalled();
      expect(orderService.addOrderToCollectionIfMissing).toHaveBeenCalledWith(
        orderCollection,
        ...additionalOrders.map(expect.objectContaining),
      );
      expect(comp.ordersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const orderAnItem: IOrderAnItem = { id: 456 };
      const order: IOrder = { id: 30512 };
      orderAnItem.order = order;

      activatedRoute.data = of({ orderAnItem });
      comp.ngOnInit();

      expect(comp.ordersSharedCollection).toContain(order);
      expect(comp.orderAnItem).toEqual(orderAnItem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderAnItem>>();
      const orderAnItem = { id: 123 };
      jest.spyOn(orderAnItemFormService, 'getOrderAnItem').mockReturnValue(orderAnItem);
      jest.spyOn(orderAnItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderAnItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderAnItem }));
      saveSubject.complete();

      // THEN
      expect(orderAnItemFormService.getOrderAnItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderAnItemService.update).toHaveBeenCalledWith(expect.objectContaining(orderAnItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderAnItem>>();
      const orderAnItem = { id: 123 };
      jest.spyOn(orderAnItemFormService, 'getOrderAnItem').mockReturnValue({ id: null });
      jest.spyOn(orderAnItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderAnItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderAnItem }));
      saveSubject.complete();

      // THEN
      expect(orderAnItemFormService.getOrderAnItem).toHaveBeenCalled();
      expect(orderAnItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOrderAnItem>>();
      const orderAnItem = { id: 123 };
      jest.spyOn(orderAnItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderAnItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderAnItemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOrder', () => {
      it('Should forward to orderService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(orderService, 'compareOrder');
        comp.compareOrder(entity, entity2);
        expect(orderService.compareOrder).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
