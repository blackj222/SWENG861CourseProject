import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../employee-information.test-samples';

import { EmployeeInformationFormService } from './employee-information-form.service';

describe('EmployeeInformation Form Service', () => {
  let service: EmployeeInformationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeInformationFormService);
  });

  describe('Service methods', () => {
    describe('createEmployeeInformationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmployeeInformationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            handle: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IEmployeeInformation should create a new form with FormGroup', () => {
        const formGroup = service.createEmployeeInformationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            handle: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getEmployeeInformation', () => {
      it('should return NewEmployeeInformation for default EmployeeInformation initial value', () => {
        const formGroup = service.createEmployeeInformationFormGroup(sampleWithNewData);

        const employeeInformation = service.getEmployeeInformation(formGroup) as any;

        expect(employeeInformation).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmployeeInformation for empty EmployeeInformation initial value', () => {
        const formGroup = service.createEmployeeInformationFormGroup();

        const employeeInformation = service.getEmployeeInformation(formGroup) as any;

        expect(employeeInformation).toMatchObject({});
      });

      it('should return IEmployeeInformation', () => {
        const formGroup = service.createEmployeeInformationFormGroup(sampleWithRequiredData);

        const employeeInformation = service.getEmployeeInformation(formGroup) as any;

        expect(employeeInformation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmployeeInformation should not enable id FormControl', () => {
        const formGroup = service.createEmployeeInformationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmployeeInformation should disable id FormControl', () => {
        const formGroup = service.createEmployeeInformationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
