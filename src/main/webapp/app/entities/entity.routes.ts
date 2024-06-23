import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'sweng861CourseProjectApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'employee-information',
    data: { pageTitle: 'sweng861CourseProjectApp.employeeInformation.home.title' },
    loadChildren: () => import('./employee-information/employee-information.routes'),
  },
  {
    path: 'order',
    data: { pageTitle: 'sweng861CourseProjectApp.order.home.title' },
    loadChildren: () => import('./order/order.routes'),
  },
  {
    path: 'item',
    data: { pageTitle: 'sweng861CourseProjectApp.item.home.title' },
    loadChildren: () => import('./item/item.routes'),
  },
  {
    path: 'order-an-item',
    data: { pageTitle: 'sweng861CourseProjectApp.orderAnItem.home.title' },
    loadChildren: () => import('./order-an-item/order-an-item.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
