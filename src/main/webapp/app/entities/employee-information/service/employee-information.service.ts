import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmployeeInformation, NewEmployeeInformation } from '../employee-information.model';

export type PartialUpdateEmployeeInformation = Partial<IEmployeeInformation> & Pick<IEmployeeInformation, 'id'>;

export type EntityResponseType = HttpResponse<IEmployeeInformation>;
export type EntityArrayResponseType = HttpResponse<IEmployeeInformation[]>;

@Injectable({ providedIn: 'root' })
export class EmployeeInformationService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/employee-informations');

  create(employeeInformation: NewEmployeeInformation): Observable<EntityResponseType> {
    return this.http.post<IEmployeeInformation>(this.resourceUrl, employeeInformation, { observe: 'response' });
  }

  update(employeeInformation: IEmployeeInformation): Observable<EntityResponseType> {
    return this.http.put<IEmployeeInformation>(
      `${this.resourceUrl}/${this.getEmployeeInformationIdentifier(employeeInformation)}`,
      employeeInformation,
      { observe: 'response' },
    );
  }

  partialUpdate(employeeInformation: PartialUpdateEmployeeInformation): Observable<EntityResponseType> {
    return this.http.patch<IEmployeeInformation>(
      `${this.resourceUrl}/${this.getEmployeeInformationIdentifier(employeeInformation)}`,
      employeeInformation,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmployeeInformation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmployeeInformation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEmployeeInformationIdentifier(employeeInformation: Pick<IEmployeeInformation, 'id'>): number {
    return employeeInformation.id;
  }

  compareEmployeeInformation(o1: Pick<IEmployeeInformation, 'id'> | null, o2: Pick<IEmployeeInformation, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmployeeInformationIdentifier(o1) === this.getEmployeeInformationIdentifier(o2) : o1 === o2;
  }

  addEmployeeInformationToCollectionIfMissing<Type extends Pick<IEmployeeInformation, 'id'>>(
    employeeInformationCollection: Type[],
    ...employeeInformationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const employeeInformations: Type[] = employeeInformationsToCheck.filter(isPresent);
    if (employeeInformations.length > 0) {
      const employeeInformationCollectionIdentifiers = employeeInformationCollection.map(employeeInformationItem =>
        this.getEmployeeInformationIdentifier(employeeInformationItem),
      );
      const employeeInformationsToAdd = employeeInformations.filter(employeeInformationItem => {
        const employeeInformationIdentifier = this.getEmployeeInformationIdentifier(employeeInformationItem);
        if (employeeInformationCollectionIdentifiers.includes(employeeInformationIdentifier)) {
          return false;
        }
        employeeInformationCollectionIdentifiers.push(employeeInformationIdentifier);
        return true;
      });
      return [...employeeInformationsToAdd, ...employeeInformationCollection];
    }
    return employeeInformationCollection;
  }
}
