import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IItem, NewItem } from '../item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItem for edit and NewItemFormGroupInput for create.
 */
type ItemFormGroupInput = IItem | PartialWithRequiredKeyOf<NewItem>;

type ItemFormDefaults = Pick<NewItem, 'id' | 'isBestSeller' | 'isAmazonChoice' | 'isPrime' | 'climatePledgeFriendly'>;

type ItemFormGroupContent = {
  id: FormControl<IItem['id'] | NewItem['id']>;
  asin: FormControl<IItem['asin']>;
  productTitle: FormControl<IItem['productTitle']>;
  productPrice: FormControl<IItem['productPrice']>;
  productOriginalPrice: FormControl<IItem['productOriginalPrice']>;
  currency: FormControl<IItem['currency']>;
  productStarRating: FormControl<IItem['productStarRating']>;
  productNumRatings: FormControl<IItem['productNumRatings']>;
  productUrl: FormControl<IItem['productUrl']>;
  productPhoto: FormControl<IItem['productPhoto']>;
  productNumOffers: FormControl<IItem['productNumOffers']>;
  productMinimumOfferPrice: FormControl<IItem['productMinimumOfferPrice']>;
  isBestSeller: FormControl<IItem['isBestSeller']>;
  isAmazonChoice: FormControl<IItem['isAmazonChoice']>;
  isPrime: FormControl<IItem['isPrime']>;
  climatePledgeFriendly: FormControl<IItem['climatePledgeFriendly']>;
  salesVolume: FormControl<IItem['salesVolume']>;
  delivery: FormControl<IItem['delivery']>;
  couponText: FormControl<IItem['couponText']>;
  order: FormControl<IItem['order']>;
};

export type ItemFormGroup = FormGroup<ItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItemFormService {
  createItemFormGroup(item: ItemFormGroupInput = { id: null }): ItemFormGroup {
    const itemRawValue = {
      ...this.getFormDefaults(),
      ...item,
    };
    return new FormGroup<ItemFormGroupContent>({
      id: new FormControl(
        { value: itemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      asin: new FormControl(itemRawValue.asin, {
        validators: [Validators.required],
      }),
      productTitle: new FormControl(itemRawValue.productTitle),
      productPrice: new FormControl(itemRawValue.productPrice),
      productOriginalPrice: new FormControl(itemRawValue.productOriginalPrice),
      currency: new FormControl(itemRawValue.currency),
      productStarRating: new FormControl(itemRawValue.productStarRating),
      productNumRatings: new FormControl(itemRawValue.productNumRatings),
      productUrl: new FormControl(itemRawValue.productUrl),
      productPhoto: new FormControl(itemRawValue.productPhoto),
      productNumOffers: new FormControl(itemRawValue.productNumOffers),
      productMinimumOfferPrice: new FormControl(itemRawValue.productMinimumOfferPrice),
      isBestSeller: new FormControl(itemRawValue.isBestSeller),
      isAmazonChoice: new FormControl(itemRawValue.isAmazonChoice),
      isPrime: new FormControl(itemRawValue.isPrime),
      climatePledgeFriendly: new FormControl(itemRawValue.climatePledgeFriendly),
      salesVolume: new FormControl(itemRawValue.salesVolume),
      delivery: new FormControl(itemRawValue.delivery),
      couponText: new FormControl(itemRawValue.couponText),
      order: new FormControl(itemRawValue.order),
    });
  }

  getItem(form: ItemFormGroup): IItem | NewItem {
    return form.getRawValue() as IItem | NewItem;
  }

  resetForm(form: ItemFormGroup, item: ItemFormGroupInput): void {
    const itemRawValue = { ...this.getFormDefaults(), ...item };
    form.reset(
      {
        ...itemRawValue,
        id: { value: itemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ItemFormDefaults {
    return {
      id: null,
      isBestSeller: false,
      isAmazonChoice: false,
      isPrime: false,
      climatePledgeFriendly: false,
    };
  }
}
