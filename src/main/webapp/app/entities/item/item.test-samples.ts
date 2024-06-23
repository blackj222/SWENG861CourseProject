import { IItem, NewItem } from './item.model';

export const sampleWithRequiredData: IItem = {
  id: 805,
  asin: 'belfry medicine',
};

export const sampleWithPartialData: IItem = {
  id: 12407,
  asin: 'inasmuch',
  productPrice: 'white frail',
  currency: 'duh gosh ick',
  productStarRating: 'syringe',
  productUrl: 'zowie telemeter yet',
  productPhoto: 'hmph blank',
  isPrime: true,
  salesVolume: 'exactly psst',
};

export const sampleWithFullData: IItem = {
  id: 11183,
  asin: 'kookily seize favorite',
  productTitle: 'huzzah randomisation',
  productPrice: 'whenever separately',
  productOriginalPrice: 'jade yahoo',
  currency: 'vanilla hm fondly',
  productStarRating: 'close oblong',
  productNumRatings: 25180,
  productUrl: 'sans solidarity',
  productPhoto: 'legitimacy excluding join',
  productNumOffers: 7894,
  productMinimumOfferPrice: 'parched',
  isBestSeller: false,
  isAmazonChoice: true,
  isPrime: false,
  climatePledgeFriendly: true,
  salesVolume: 'bijou',
  delivery: 'quince',
  couponText: 'factor though',
};

export const sampleWithNewData: NewItem = {
  asin: 'cheerfully',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
