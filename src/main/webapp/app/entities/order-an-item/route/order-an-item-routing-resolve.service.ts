import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrderAnItem } from '../order-an-item.model';
import { OrderAnItemService } from '../service/order-an-item.service';

const orderAnItemResolve = (route: ActivatedRouteSnapshot): Observable<null | IOrderAnItem> => {
  const id = route.params['id'];
  if (id) {
    return inject(OrderAnItemService)
      .find(id)
      .pipe(
        mergeMap((orderAnItem: HttpResponse<IOrderAnItem>) => {
          if (orderAnItem.body) {
            return of(orderAnItem.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default orderAnItemResolve;
