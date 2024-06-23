import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOrderAnItem, NewOrderAnItem } from '../order-an-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrderAnItem for edit and NewOrderAnItemFormGroupInput for create.
 */
type OrderAnItemFormGroupInput = IOrderAnItem | PartialWithRequiredKeyOf<NewOrderAnItem>;

type OrderAnItemFormDefaults = Pick<NewOrderAnItem, 'id' | 'isBestSeller' | 'isAmazonChoice' | 'isPrime' | 'climatePledgeFriendly'>;

type OrderAnItemFormGroupContent = {
  id: FormControl<IOrderAnItem['id'] | NewOrderAnItem['id']>;
  asin: FormControl<IOrderAnItem['asin']>;
  productTitle: FormControl<IOrderAnItem['productTitle']>;
  productPrice: FormControl<IOrderAnItem['productPrice']>;
  productOriginalPrice: FormControl<IOrderAnItem['productOriginalPrice']>;
  currency: FormControl<IOrderAnItem['currency']>;
  productStarRating: FormControl<IOrderAnItem['productStarRating']>;
  productNumRatings: FormControl<IOrderAnItem['productNumRatings']>;
  productUrl: FormControl<IOrderAnItem['productUrl']>;
  productPhoto: FormControl<IOrderAnItem['productPhoto']>;
  productNumOffers: FormControl<IOrderAnItem['productNumOffers']>;
  productMinimumOfferPrice: FormControl<IOrderAnItem['productMinimumOfferPrice']>;
  isBestSeller: FormControl<IOrderAnItem['isBestSeller']>;
  isAmazonChoice: FormControl<IOrderAnItem['isAmazonChoice']>;
  isPrime: FormControl<IOrderAnItem['isPrime']>;
  climatePledgeFriendly: FormControl<IOrderAnItem['climatePledgeFriendly']>;
  salesVolume: FormControl<IOrderAnItem['salesVolume']>;
  delivery: FormControl<IOrderAnItem['delivery']>;
  couponText: FormControl<IOrderAnItem['couponText']>;
  order: FormControl<IOrderAnItem['order']>;
};

export type OrderAnItemFormGroup = FormGroup<OrderAnItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrderAnItemFormService {
  createOrderAnItemFormGroup(orderAnItem: OrderAnItemFormGroupInput = { id: null }): OrderAnItemFormGroup {
    const orderAnItemRawValue = {
      ...this.getFormDefaults(),
      ...orderAnItem,
    };
    return new FormGroup<OrderAnItemFormGroupContent>({
      id: new FormControl(
        { value: orderAnItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      asin: new FormControl(orderAnItemRawValue.asin, {
        validators: [Validators.required],
      }),
      productTitle: new FormControl(orderAnItemRawValue.productTitle),
      productPrice: new FormControl(orderAnItemRawValue.productPrice),
      productOriginalPrice: new FormControl(orderAnItemRawValue.productOriginalPrice),
      currency: new FormControl(orderAnItemRawValue.currency),
      productStarRating: new FormControl(orderAnItemRawValue.productStarRating),
      productNumRatings: new FormControl(orderAnItemRawValue.productNumRatings),
      productUrl: new FormControl(orderAnItemRawValue.productUrl),
      productPhoto: new FormControl(orderAnItemRawValue.productPhoto),
      productNumOffers: new FormControl(orderAnItemRawValue.productNumOffers),
      productMinimumOfferPrice: new FormControl(orderAnItemRawValue.productMinimumOfferPrice),
      isBestSeller: new FormControl(orderAnItemRawValue.isBestSeller),
      isAmazonChoice: new FormControl(orderAnItemRawValue.isAmazonChoice),
      isPrime: new FormControl(orderAnItemRawValue.isPrime),
      climatePledgeFriendly: new FormControl(orderAnItemRawValue.climatePledgeFriendly),
      salesVolume: new FormControl(orderAnItemRawValue.salesVolume),
      delivery: new FormControl(orderAnItemRawValue.delivery),
      couponText: new FormControl(orderAnItemRawValue.couponText),
      order: new FormControl(orderAnItemRawValue.order),
    });
  }

  getOrderAnItem(form: OrderAnItemFormGroup): IOrderAnItem | NewOrderAnItem {
    return form.getRawValue() as IOrderAnItem | NewOrderAnItem;
  }

  resetForm(form: OrderAnItemFormGroup, orderAnItem: OrderAnItemFormGroupInput): void {
    const orderAnItemRawValue = { ...this.getFormDefaults(), ...orderAnItem };
    form.reset(
      {
        ...orderAnItemRawValue,
        id: { value: orderAnItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): OrderAnItemFormDefaults {
    return {
      id: null,
      isBestSeller: false,
      isAmazonChoice: false,
      isPrime: false,
      climatePledgeFriendly: false,
    };
  }
}
