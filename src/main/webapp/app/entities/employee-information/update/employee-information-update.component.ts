import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IEmployeeInformation } from '../employee-information.model';
import { EmployeeInformationService } from '../service/employee-information.service';
import { EmployeeInformationFormService, EmployeeInformationFormGroup } from './employee-information-form.service';

@Component({
  standalone: true,
  selector: 'jhi-employee-information-update',
  templateUrl: './employee-information-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EmployeeInformationUpdateComponent implements OnInit {
  isSaving = false;
  employeeInformation: IEmployeeInformation | null = null;

  usersSharedCollection: IUser[] = [];

  protected employeeInformationService = inject(EmployeeInformationService);
  protected employeeInformationFormService = inject(EmployeeInformationFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EmployeeInformationFormGroup = this.employeeInformationFormService.createEmployeeInformationFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employeeInformation }) => {
      this.employeeInformation = employeeInformation;
      if (employeeInformation) {
        this.updateForm(employeeInformation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const employeeInformation = this.employeeInformationFormService.getEmployeeInformation(this.editForm);
    if (employeeInformation.id !== null) {
      this.subscribeToSaveResponse(this.employeeInformationService.update(employeeInformation));
    } else {
      this.subscribeToSaveResponse(this.employeeInformationService.create(employeeInformation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployeeInformation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(employeeInformation: IEmployeeInformation): void {
    this.employeeInformation = employeeInformation;
    this.employeeInformationFormService.resetForm(this.editForm, employeeInformation);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, employeeInformation.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.employeeInformation?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
