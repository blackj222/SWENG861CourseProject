import { IOrder } from 'app/entities/order/order.model';

export interface IItem {
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

export type NewItem = Omit<IItem, 'id'> & { id: null };
