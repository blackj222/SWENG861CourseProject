import { IOrderAnItem, NewOrderAnItem } from './order-an-item.model';

export const sampleWithRequiredData: IOrderAnItem = {
  id: 21325,
  asin: 'fooey',
};

export const sampleWithPartialData: IOrderAnItem = {
  id: 31149,
  asin: 'distorted',
  productTitle: 'throughout macro',
  productPrice: 'ick vice',
  currency: 'even',
  productStarRating: 'mistake unabashedly via',
  productNumRatings: 13637,
  isBestSeller: false,
  climatePledgeFriendly: true,
  salesVolume: 'incur',
  delivery: 'vain vet',
  couponText: 'under deem',
};

export const sampleWithFullData: IOrderAnItem = {
  id: 16702,
  asin: 'arid spearhead editor',
  productTitle: 'violently dump',
  productPrice: 'past gee',
  productOriginalPrice: 'leafy inside but',
  currency: 'culvert agile midst',
  productStarRating: 'complex',
  productNumRatings: 16646,
  productUrl: 'hose amidst county',
  productPhoto: 'bulky overflow',
  productNumOffers: 29842,
  productMinimumOfferPrice: 'fondly feisty',
  isBestSeller: true,
  isAmazonChoice: false,
  isPrime: false,
  climatePledgeFriendly: true,
  salesVolume: 'deploy',
  delivery: 'blah',
  couponText: 'sheepishly meh perfect',
};

export const sampleWithNewData: NewOrderAnItem = {
  asin: 'rightfully overgeneralise',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
