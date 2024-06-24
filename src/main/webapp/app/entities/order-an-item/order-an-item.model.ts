import { IOrder } from 'app/entities/order/order.model';

export interface IOrderAnItem {
  id: number;
  asin?: string | null;
  productTitle?: string | null;
  productPrice?: string | null;
  productOriginalPrice?: string | null;
  currency?: string | null;
  productStarRating?: string | null;
  productNumRatings?: number | null;
  productUrl?: string | null;
  productPhoto?: string | null;
  productNumOffers?: number | null;
  productMinimumOfferPrice?: string | null;
  isBestSeller?: boolean | null;
  isAmazonChoice?: boolean | null;
  isPrime?: boolean | null;
  climatePledgeFriendly?: boolean | null;
  salesVolume?: string | null;
  delivery?: string | null;
  couponText?: string | null;
  order?: IOrder | null;
}

export type NewOrderAnItem = Omit<IOrderAnItem, 'id'> & { id: null };

export function createIOrderAnItem(
  vId: number,
  parameter: Omit<IOrderAnItem, 'id'>,
): {
  id: number;
  productNumOffers?: number | null;
  climatePledgeFriendly?: boolean | null;
  productOriginalPrice?: string | null;
  delivery?: string | null;
  productPhoto?: string | null;
  salesVolume?: string | null;
  couponText?: string | null;
  isBestSeller?: boolean | null;
  productTitle?: string | null;
  productMinimumOfferPrice?: string | null;
  productStarRating?: string | null;
  asin?: string | null;
  currency?: string | null;
  productUrl?: string | null;
  productNumRatings?: number | null;
  isPrime?: boolean | null;
  productPrice?: string | null;
  isAmazonChoice?: boolean | null;
  order?: IOrder | null;
} {
  return {
    id: vId,
    ...parameter,
  };
}
