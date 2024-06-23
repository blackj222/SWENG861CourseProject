import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEmployeeInformation, NewEmployeeInformation } from '../employee-information.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmployeeInformation for edit and NewEmployeeInformationFormGroupInput for create.
 */
type EmployeeInformationFormGroupInput = IEmployeeInformation | PartialWithRequiredKeyOf<NewEmployeeInformation>;

type EmployeeInformationFormDefaults = Pick<NewEmployeeInformation, 'id'>;

type EmployeeInformationFormGroupContent = {
  id: FormControl<IEmployeeInformation['id'] | NewEmployeeInformation['id']>;
  name: FormControl<IEmployeeInformation['name']>;
  handle: FormControl<IEmployeeInformation['handle']>;
  user: FormControl<IEmployeeInformation['user']>;
};

export type EmployeeInformationFormGroup = FormGroup<EmployeeInformationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmployeeInformationFormService {
  createEmployeeInformationFormGroup(employeeInformation: EmployeeInformationFormGroupInput = { id: null }): EmployeeInformationFormGroup {
    const employeeInformationRawValue = {
      ...this.getFormDefaults(),
      ...employeeInformation,
    };
    return new FormGroup<EmployeeInformationFormGroupContent>({
      id: new FormControl(
        { value: employeeInformationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(employeeInformationRawValue.name, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      handle: new FormControl(employeeInformationRawValue.handle, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      user: new FormControl(employeeInformationRawValue.user),
    });
  }

  getEmployeeInformation(form: EmployeeInformationFormGroup): IEmployeeInformation | NewEmployeeInformation {
    return form.getRawValue() as IEmployeeInformation | NewEmployeeInformation;
  }

  resetForm(form: EmployeeInformationFormGroup, employeeInformation: EmployeeInformationFormGroupInput): void {
    const employeeInformationRawValue = { ...this.getFormDefaults(), ...employeeInformation };
    form.reset(
      {
        ...employeeInformationRawValue,
        id: { value: employeeInformationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EmployeeInformationFormDefaults {
    return {
      id: null,
    };
  }
}
