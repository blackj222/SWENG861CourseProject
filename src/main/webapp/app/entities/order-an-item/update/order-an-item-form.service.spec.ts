import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../order-an-item.test-samples';

import { OrderAnItemFormService } from './order-an-item-form.service';

describe('OrderAnItem Form Service', () => {
  let service: OrderAnItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderAnItemFormService);
  });

  describe('Service methods', () => {
    describe('createOrderAnItemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOrderAnItemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            asin: expect.any(Object),
            productTitle: expect.any(Object),
            productPrice: expect.any(Object),
            productOriginalPrice: expect.any(Object),
            currency: expect.any(Object),
            productStarRating: expect.any(Object),
            productNumRatings: expect.any(Object),
            productUrl: expect.any(Object),
            productPhoto: expect.any(Object),
            productNumOffers: expect.any(Object),
            productMinimumOfferPrice: expect.any(Object),
            isBestSeller: expect.any(Object),
            isAmazonChoice: expect.any(Object),
            isPrime: expect.any(Object),
            climatePledgeFriendly: expect.any(Object),
            salesVolume: expect.any(Object),
            delivery: expect.any(Object),
            couponText: expect.any(Object),
            order: expect.any(Object),
          }),
        );
      });

      it('passing IOrderAnItem should create a new form with FormGroup', () => {
        const formGroup = service.createOrderAnItemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            asin: expect.any(Object),
            productTitle: expect.any(Object),
            productPrice: expect.any(Object),
            productOriginalPrice: expect.any(Object),
            currency: expect.any(Object),
            productStarRating: expect.any(Object),
            productNumRatings: expect.any(Object),
            productUrl: expect.any(Object),
            productPhoto: expect.any(Object),
            productNumOffers: expect.any(Object),
            productMinimumOfferPrice: expect.any(Object),
            isBestSeller: expect.any(Object),
            isAmazonChoice: expect.any(Object),
            isPrime: expect.any(Object),
            climatePledgeFriendly: expect.any(Object),
            salesVolume: expect.any(Object),
            delivery: expect.any(Object),
            couponText: expect.any(Object),
            order: expect.any(Object),
          }),
        );
      });
    });

    describe('getOrderAnItem', () => {
      it('should return NewOrderAnItem for default OrderAnItem initial value', () => {
        const formGroup = service.createOrderAnItemFormGroup(sampleWithNewData);

        const orderAnItem = service.getOrderAnItem(formGroup) as any;

        expect(orderAnItem).toMatchObject(sampleWithNewData);
      });

      it('should return NewOrderAnItem for empty OrderAnItem initial value', () => {
        const formGroup = service.createOrderAnItemFormGroup();

        const orderAnItem = service.getOrderAnItem(formGroup) as any;

        expect(orderAnItem).toMatchObject({});
      });

      it('should return IOrderAnItem', () => {
        const formGroup = service.createOrderAnItemFormGroup(sampleWithRequiredData);

        const orderAnItem = service.getOrderAnItem(formGroup) as any;

        expect(orderAnItem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOrderAnItem should not enable id FormControl', () => {
        const formGroup = service.createOrderAnItemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOrderAnItem should disable id FormControl', () => {
        const formGroup = service.createOrderAnItemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
