import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EmployeeInformationComponent } from './list/employee-information.component';
import { EmployeeInformationDetailComponent } from './detail/employee-information-detail.component';
import { EmployeeInformationUpdateComponent } from './update/employee-information-update.component';
import EmployeeInformationResolve from './route/employee-information-routing-resolve.service';

const employeeInformationRoute: Routes = [
  {
    path: '',
    component: EmployeeInformationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmployeeInformationDetailComponent,
    resolve: {
      employeeInformation: EmployeeInformationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmployeeInformationUpdateComponent,
    resolve: {
      employeeInformation: EmployeeInformationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmployeeInformationUpdateComponent,
    resolve: {
      employeeInformation: EmployeeInformationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default employeeInformationRoute;
