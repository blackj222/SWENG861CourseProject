import { Component, computed, NgZone, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { sortStateSignal, SortDirective, SortByDirective, type SortState, SortService } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EntityArrayResponseType, EmployeeInformationService } from '../service/employee-information.service';
import { EmployeeInformationDeleteDialogComponent } from '../delete/employee-information-delete-dialog.component';
import { IEmployeeInformation } from '../employee-information.model';

@Component({
  standalone: true,
  selector: 'jhi-employee-information',
  templateUrl: './employee-information.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    InfiniteScrollModule,
  ],
})
export class EmployeeInformationComponent implements OnInit {
  subscription: Subscription | null = null;
  employeeInformations?: IEmployeeInformation[];
  isLoading = false;

  sortState = sortStateSignal({});

  itemsPerPage = ITEMS_PER_PAGE;
  links: WritableSignal<{ [key: string]: undefined | { [key: string]: string | undefined } }> = signal({});
  hasMorePage = computed(() => !!this.links().next);
  isFirstFetch = computed(() => Object.keys(this.links()).length === 0);

  public router = inject(Router);
  protected employeeInformationService = inject(EmployeeInformationService);
  protected activatedRoute = inject(ActivatedRoute);
  protected sortService = inject(SortService);
  protected parseLinks = inject(ParseLinks);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (_index: number, item: IEmployeeInformation): number => this.employeeInformationService.getEmployeeInformationIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => this.reset()),
        tap(() => this.load()),
      )
      .subscribe();
  }

  reset(): void {
    this.employeeInformations = [];
  }

  loadNextPage(): void {
    this.load();
  }

  delete(employeeInformation: IEmployeeInformation): void {
    const modalRef = this.modalService.open(EmployeeInformationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.employeeInformation = employeeInformation;
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

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.employeeInformations = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IEmployeeInformation[] | null): IEmployeeInformation[] {
    // If there is previous link, data is a infinite scroll pagination content.
    if (this.links().prev) {
      const employeeInformationsNew = this.employeeInformations ?? [];
      if (data) {
        for (const d of data) {
          if (employeeInformationsNew.map(op => op.id).indexOf(d.id) === -1) {
            employeeInformationsNew.push(d);
          }
        }
      }
      return employeeInformationsNew;
    }
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links.set(this.parseLinks.parseAll(linkHeader));
    } else {
      this.links.set({});
    }
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      size: this.itemsPerPage,
      eagerload: true,
    };
    if (this.hasMorePage()) {
      Object.assign(queryObject, this.links().next);
    } else if (this.isFirstFetch()) {
      Object.assign(queryObject, { sort: this.sortService.buildSortParam(this.sortState()) });
    }

    return this.employeeInformationService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    this.links.set({});

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
