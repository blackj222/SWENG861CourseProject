import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrderAnItem, NewOrderAnItem } from '../order-an-item.model';

export type PartialUpdateOrderAnItem = Partial<IOrderAnItem> & Pick<IOrderAnItem, 'id'>;

export type EntityResponseType = HttpResponse<IOrderAnItem>;
export type EntityArrayResponseType = HttpResponse<IOrderAnItem[]>;

@Injectable({ providedIn: 'root' })
export class OrderAnItemService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/order-an-items');

  create(orderAnItem: NewOrderAnItem): Observable<EntityResponseType> {
    return this.http.post<IOrderAnItem>(this.resourceUrl, orderAnItem, { observe: 'response' });
  }

  update(orderAnItem: IOrderAnItem): Observable<EntityResponseType> {
    return this.http.put<IOrderAnItem>(`${this.resourceUrl}/${this.getOrderAnItemIdentifier(orderAnItem)}`, orderAnItem, {
      observe: 'response',
    });
  }

  partialUpdate(orderAnItem: PartialUpdateOrderAnItem): Observable<EntityResponseType> {
    return this.http.patch<IOrderAnItem>(`${this.resourceUrl}/${this.getOrderAnItemIdentifier(orderAnItem)}`, orderAnItem, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOrderAnItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOrderAnItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOrderAnItemIdentifier(orderAnItem: Pick<IOrderAnItem, 'id'>): number {
    return orderAnItem.id;
  }

  compareOrderAnItem(o1: Pick<IOrderAnItem, 'id'> | null, o2: Pick<IOrderAnItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getOrderAnItemIdentifier(o1) === this.getOrderAnItemIdentifier(o2) : o1 === o2;
  }

  addOrderAnItemToCollectionIfMissing<Type extends Pick<IOrderAnItem, 'id'>>(
    orderAnItemCollection: Type[],
    ...orderAnItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const orderAnItems: Type[] = orderAnItemsToCheck.filter(isPresent);
    if (orderAnItems.length > 0) {
      const orderAnItemCollectionIdentifiers = orderAnItemCollection.map(orderAnItemItem => this.getOrderAnItemIdentifier(orderAnItemItem));
      const orderAnItemsToAdd = orderAnItems.filter(orderAnItemItem => {
        const orderAnItemIdentifier = this.getOrderAnItemIdentifier(orderAnItemItem);
        if (orderAnItemCollectionIdentifiers.includes(orderAnItemIdentifier)) {
          return false;
        }
        orderAnItemCollectionIdentifiers.push(orderAnItemIdentifier);
        return true;
      });
      return [...orderAnItemsToAdd, ...orderAnItemCollection];
    }
    return orderAnItemCollection;
  }
}
