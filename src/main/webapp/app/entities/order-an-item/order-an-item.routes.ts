import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { OrderAnItemComponent } from './list/order-an-item.component';
import { OrderAnItemDetailComponent } from './detail/order-an-item-detail.component';
import { OrderAnItemUpdateComponent } from './update/order-an-item-update.component';
import OrderAnItemResolve from './route/order-an-item-routing-resolve.service';

const orderAnItemRoute: Routes = [
  {
    path: '',
    component: OrderAnItemComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrderAnItemDetailComponent,
    resolve: {
      orderAnItem: OrderAnItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrderAnItemUpdateComponent,
    resolve: {
      orderAnItem: OrderAnItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrderAnItemUpdateComponent,
    resolve: {
      orderAnItem: OrderAnItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default orderAnItemRoute;
