import { Component, inject, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { createIOrderAnItem, IOrderAnItem, NewOrderAnItem } from '../order-an-item.model';
import { EntityArrayResponseType, OrderAnItemService } from '../service/order-an-item.service';
import { OrderAnItemDeleteDialogComponent } from '../delete/order-an-item-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-order-an-item',
  templateUrl: './order-an-item.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    ReactiveFormsModule,
  ],
})
export class OrderAnItemComponent implements OnInit {
  subscription: Subscription | null = null;
  orderAnItems?: IOrderAnItem[];
  isLoading = false;

  sortState = sortStateSignal({});

  public router = inject(Router);
  protected orderAnItemService = inject(OrderAnItemService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  apiJson = '';

  trackId = (_index: number, item: IOrderAnItem): number => this.orderAnItemService.getOrderAnItemIdentifier(item);

  ngOnInit(): void {
    this.newLoad();
  }

  delete(orderAnItem: IOrderAnItem): void {
    const modalRef = this.modalService.open(OrderAnItemDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.orderAnItem = orderAnItem;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  async amazonSearch(amazonSearchString: String) {
    const url =
      'https://real-time-amazon-data.p.rapidapi.com/search?query=' +
      amazonSearchString +
      '&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'dbaecc3f77msh44ac418a6aae978p119ae9jsne358b945f698',
        'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      return 'See error';
    }
  }

  newLoad = async () => {
    let jsonSchema = {
      type: 'object',
      properties: {
        status: {
          type: 'string',
        },
        request_id: {
          type: 'string',
        },
        data: {
          type: 'object',
          properties: {
            total_products: {
              type: 'integer',
            },
            country: {
              type: 'string',
            },
            domain: {
              type: 'string',
            },
            products: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
      },
    };

    let jsonExample = {
      status: 'OK',
      request_id: '0adb321a-e11d-48b4-9671-43d2797ed2b3',
      data: {
        total_products: 4096,
        country: 'US',
        domain: 'www.amazon.com',
        products: [
          {
            asin: 'B017RZ45F6',
            product_title:
              'Pro For Sho 34dB Shooting Ear Protection - Special Designed Ear Muffs Lighter Weight &amp; Maximum Hearing Protection',
            product_price: '$20.89',
            product_original_price: null,
            currency: 'USD',
            product_star_rating: '4.5',
            product_num_ratings: 23000,
            product_url: 'https://www.amazon.com/dp/B017RZ45F6',
            product_photo: 'https://m.media-amazon.com/images/I/61-1EnzmQ+L._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: '$20.89',
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: true,
            sales_volume: '1K+ bought in past month',
            delivery: 'Delivery Mon, May 27 Ships to Germany',
            coupon_text: 'Save 5% with coupon (some sizes/colors)',
          },
          {
            asin: 'B07MVHLV3R',
            product_title:
              'SHO Bottle - Ultimate Vacuum Insulated, Double Walled Stainless Steel Water Bottle &amp; Drinks Bottle - 24 Hrs Cold &amp; 12 Hot - Sports Vacuum Flask BPA Free',
            product_price: '$9.99',
            product_original_price: null,
            currency: 'USD',
            product_star_rating: '4.7',
            product_num_ratings: 3994,
            product_url: 'https://www.amazon.com/dp/B07MVHLV3R',
            product_photo: 'https://m.media-amazon.com/images/I/81xTsfih8fL._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: '$9.99',
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: false,
            sales_volume: null,
            delivery: 'Delivery Mon, May 27 Ships to Germany',
          },
          {
            asin: 'B0CMV7C68G',
            product_title: 'Fallout - Season 1',
            product_price: null,
            product_original_price: null,
            currency: null,
            product_star_rating: '4.7',
            product_num_ratings: 3028,
            product_url: 'https://www.amazon.com/dp/B0CMV7C68G',
            product_photo: 'https://m.media-amazon.com/images/I/81vRr4A0eeL._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: null,
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: false,
            sales_volume: null,
            delivery: null,
          },
          {
            asin: 'B09PLLXTZM',
            product_title: 'For Ford Taurus 2010-2019 Fender Liner Passenger Side | Front | Inner Panel | FO1249144 | BG1Z16102A',
            product_price: null,
            product_original_price: null,
            currency: null,
            product_star_rating: '3.4',
            product_num_ratings: 3,
            product_url: 'https://www.amazon.com/dp/B09PLLXTZM',
            product_photo: 'https://m.media-amazon.com/images/I/41Gnie+jQvS._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: null,
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: true,
            sales_volume: null,
            delivery: 'Currently unavailable.',
          },
          {
            asin: 'B008Q0CO0U',
            product_title: 'Shooter',
            product_price: '$3.79',
            product_original_price: null,
            currency: 'USD',
            product_star_rating: '4.7',
            product_num_ratings: 13225,
            product_url: 'https://www.amazon.com/dp/B008Q0CO0U',
            product_photo: 'https://m.media-amazon.com/images/I/81OCGF9V70L._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: '$3.79',
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: false,
            sales_volume: null,
            delivery: null,
          },
          {
            asin: 'B073TQJGBX',
            product_title:
              'Pro For Sho All Terrain Safety Ear Protection - LARGER Size Foldable Ear Muffs Much Lighter Weight &amp; Maximum Hearing Protection, Black',
            product_price: '$22.55',
            product_original_price: null,
            currency: 'USD',
            product_star_rating: '4.5',
            product_num_ratings: 939,
            product_url: 'https://www.amazon.com/dp/B073TQJGBX',
            product_photo: 'https://m.media-amazon.com/images/I/61DMHBCnOaL._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: '$22.55',
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: true,
            sales_volume: '100+ bought in past month',
            delivery: '$10.76 deliveryShips to Germany',
            coupon_text: 'Save 5% with coupon',
          },
          {
            asin: 'B019969US8',
            product_title: 'The Big Short',
            product_price: '$4.29',
            product_original_price: null,
            currency: 'USD',
            product_star_rating: '4.7',
            product_num_ratings: 29181,
            product_url: 'https://www.amazon.com/dp/B019969US8',
            product_photo: 'https://m.media-amazon.com/images/I/81NOTL+z8sL._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: '$4.29',
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: false,
            sales_volume: null,
            delivery: null,
          },
          {
            asin: 'B08TZQHLMJ',
            product_title: 'The Swordsman',
            product_price: null,
            product_original_price: null,
            currency: null,
            product_star_rating: '4.6',
            product_num_ratings: 6535,
            product_url: 'https://www.amazon.com/dp/B08TZQHLMJ',
            product_photo: 'https://m.media-amazon.com/images/I/81DClEaZXtL._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: null,
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: false,
            sales_volume: null,
            delivery: null,
          },
          {
            asin: 'B074SYZYZP',
            product_title: 'Shot Caller',
            product_price: '$3.79',
            product_original_price: null,
            currency: 'USD',
            product_star_rating: '4.6',
            product_num_ratings: 5933,
            product_url: 'https://www.amazon.com/dp/B074SYZYZP',
            product_photo: 'https://m.media-amazon.com/images/I/71LJjVH1xnL._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: '$3.79',
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: false,
            sales_volume: null,
            delivery: null,
          },
          {
            asin: 'B00KKQASKQ',
            product_title: 'Sho&#x27;s B-6 Kun, Compact Hibachi Grill, 3 Piece Set',
            product_price: '$79.99',
            product_original_price: null,
            currency: 'USD',
            product_star_rating: '4.6',
            product_num_ratings: 1206,
            product_url: 'https://www.amazon.com/dp/B00KKQASKQ',
            product_photo: 'https://m.media-amazon.com/images/I/41UirLMSh3L._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: '$79.99',
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: false,
            sales_volume: null,
            delivery: 'Delivery Mon, May 27 Ships to Germany',
          },
          {
            asin: 'B0CGWMVNGJ',
            product_title: 'Mr. &amp; Mrs. Smith - Season 1',
            product_price: null,
            product_original_price: null,
            currency: null,
            product_star_rating: '3.8',
            product_num_ratings: 1345,
            product_url: 'https://www.amazon.com/dp/B0CGWMVNGJ',
            product_photo: 'https://m.media-amazon.com/images/I/913u9HowPaL._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: null,
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: false,
            sales_volume: null,
            delivery: null,
          },
          {
            asin: 'B001JUEY2A',
            product_title: 'SpongeBob SquarePants Season 4',
            product_price: '$1.99',
            product_original_price: null,
            currency: 'USD',
            product_star_rating: '4.8',
            product_num_ratings: 1661,
            product_url: 'https://www.amazon.com/dp/B001JUEY2A',
            product_photo: 'https://m.media-amazon.com/images/I/91lO1R9h1qL._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: '$1.99',
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: false,
            sales_volume: null,
            delivery: null,
          },
          {
            asin: 'B09J9ZD1N2',
            product_title: 'ShoSho Womens Winter High Waist Fleece Lined Leggings Warm Cozy Tights Yoga Pants',
            product_price: '$15.99',
            product_original_price: '$16.95',
            currency: 'USD',
            product_star_rating: '4',
            product_num_ratings: 473,
            product_url: 'https://www.amazon.com/dp/B09J9ZD1N2',
            product_photo: 'https://m.media-amazon.com/images/I/61YWcuRhICL._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: '$15.99',
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: true,
            sales_volume: null,
            delivery: 'Delivery Mon, May 27 Ships to Germany',
          },
          {
            asin: 'B0BBC271XF',
            product_title:
              'Yzixulet Sho Nuff Rage Who&#x27;s The Master Style japonais Poster Vintage 8&#x27;&#x27; x 12&#x27;&#x27; Metal Tin Sign Funny Man Cave Decor',
            product_price: '$14.99',
            product_original_price: null,
            currency: 'USD',
            product_star_rating: '4.6',
            product_num_ratings: 6,
            product_url: 'https://www.amazon.com/dp/B0BBC271XF',
            product_photo: 'https://m.media-amazon.com/images/I/61MngOM5qcL._AC_SX444_SY639_FMwebp_QL65_.jpg',
            product_num_offers: 1,
            product_minimum_offer_price: '$14.99',
            is_best_seller: false,
            is_amazon_choice: false,
            is_prime: false,
            climate_pledge_friendly: false,
            sales_volume: null,
            delivery: 'Delivery Mon, May 27 Ships to Germany',
          },
        ],
      },
    };

    let curItem: IOrderAnItem;

    this.orderAnItems = [];

    let curId = 1;
    let amazonInputBox: HTMLInputElement = document.getElementById('amazonSearchBox') as HTMLInputElement;
    let amazonSearchString: String = amazonInputBox.value;
    if (amazonSearchString !== '') {
      let jsonResult = await this.amazonSearch(amazonSearchString);

      if (jsonResult != 'See error') {
        console.log(jsonResult);
        JSON.parse(jsonResult).data.products.forEach(
          (curProduct: {
            asin: string | null | undefined;
            product_title: string | null | undefined;
            product_price: string | null | undefined;
            product_original_price: string | null | undefined;
            currency: string | null | undefined;
            product_star_rating: string | null | undefined;
            product_num_ratings: number | null | undefined;
            product_url: string | null | undefined;
            product_photo: string | null | undefined;
            product_num_offers: number | null | undefined;
            product_minimum_offer_price: string | null | undefined;
            is_best_seller: boolean | null | undefined;
            is_amazon_choice: boolean | null | undefined;
            is_prime: boolean | null | undefined;
            climate_pledge_friendly: boolean | null | undefined;
            sales_volume: string | null | undefined;
            delivery: string | null | undefined;
            coupon_text: string | null | undefined;
          }) => {
            let newOrderAnItem: IOrderAnItem | undefined = createIOrderAnItem(curId, {});
            newOrderAnItem.asin = curProduct.asin;
            newOrderAnItem.productTitle = curProduct.product_title;
            newOrderAnItem.productPrice = curProduct.product_price;
            newOrderAnItem.productOriginalPrice = curProduct.product_original_price;
            newOrderAnItem.productOriginalPrice = curProduct.product_original_price;
            newOrderAnItem.currency = curProduct.currency;
            newOrderAnItem.productStarRating = curProduct.product_star_rating;
            newOrderAnItem.productNumRatings = curProduct.product_num_ratings;
            newOrderAnItem.productUrl = curProduct.product_url;
            newOrderAnItem.productPhoto = curProduct.product_photo;
            newOrderAnItem.productNumOffers = curProduct.product_num_offers;
            newOrderAnItem.productMinimumOfferPrice = curProduct.product_minimum_offer_price;
            newOrderAnItem.isBestSeller = curProduct.is_best_seller;
            newOrderAnItem.isAmazonChoice = curProduct.is_amazon_choice;
            newOrderAnItem.isPrime = curProduct.is_prime;
            newOrderAnItem.climatePledgeFriendly = curProduct.climate_pledge_friendly;
            newOrderAnItem.salesVolume = curProduct.sales_volume;
            newOrderAnItem.delivery = curProduct.delivery;
            newOrderAnItem.couponText = curProduct.coupon_text;

            if (newOrderAnItem && this.orderAnItems) {
              this.orderAnItems.push(newOrderAnItem);
            }
            curId++;
          },
        );

        console.log(this.orderAnItems);
      }
    }
  };

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.orderAnItems = this.refineData(dataFromBody);
  }

  protected refineData(data: IOrderAnItem[]): IOrderAnItem[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IOrderAnItem[] | null): IOrderAnItem[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.orderAnItemService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
