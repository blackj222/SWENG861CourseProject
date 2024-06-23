import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmployeeInformation } from '../employee-information.model';
import { EmployeeInformationService } from '../service/employee-information.service';

const employeeInformationResolve = (route: ActivatedRouteSnapshot): Observable<null | IEmployeeInformation> => {
  const id = route.params['id'];
  if (id) {
    return inject(EmployeeInformationService)
      .find(id)
      .pipe(
        mergeMap((employeeInformation: HttpResponse<IEmployeeInformation>) => {
          if (employeeInformation.body) {
            return of(employeeInformation.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default employeeInformationResolve;
