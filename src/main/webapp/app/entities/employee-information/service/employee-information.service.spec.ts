import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEmployeeInformation } from '../employee-information.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../employee-information.test-samples';

import { EmployeeInformationService } from './employee-information.service';

const requireRestSample: IEmployeeInformation = {
  ...sampleWithRequiredData,
};

describe('EmployeeInformation Service', () => {
  let service: EmployeeInformationService;
  let httpMock: HttpTestingController;
  let expectedResult: IEmployeeInformation | IEmployeeInformation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EmployeeInformationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a EmployeeInformation', () => {
      const employeeInformation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(employeeInformation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EmployeeInformation', () => {
      const employeeInformation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(employeeInformation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EmployeeInformation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EmployeeInformation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EmployeeInformation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEmployeeInformationToCollectionIfMissing', () => {
      it('should add a EmployeeInformation to an empty array', () => {
        const employeeInformation: IEmployeeInformation = sampleWithRequiredData;
        expectedResult = service.addEmployeeInformationToCollectionIfMissing([], employeeInformation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(employeeInformation);
      });

      it('should not add a EmployeeInformation to an array that contains it', () => {
        const employeeInformation: IEmployeeInformation = sampleWithRequiredData;
        const employeeInformationCollection: IEmployeeInformation[] = [
          {
            ...employeeInformation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEmployeeInformationToCollectionIfMissing(employeeInformationCollection, employeeInformation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EmployeeInformation to an array that doesn't contain it", () => {
        const employeeInformation: IEmployeeInformation = sampleWithRequiredData;
        const employeeInformationCollection: IEmployeeInformation[] = [sampleWithPartialData];
        expectedResult = service.addEmployeeInformationToCollectionIfMissing(employeeInformationCollection, employeeInformation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(employeeInformation);
      });

      it('should add only unique EmployeeInformation to an array', () => {
        const employeeInformationArray: IEmployeeInformation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const employeeInformationCollection: IEmployeeInformation[] = [sampleWithRequiredData];
        expectedResult = service.addEmployeeInformationToCollectionIfMissing(employeeInformationCollection, ...employeeInformationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const employeeInformation: IEmployeeInformation = sampleWithRequiredData;
        const employeeInformation2: IEmployeeInformation = sampleWithPartialData;
        expectedResult = service.addEmployeeInformationToCollectionIfMissing([], employeeInformation, employeeInformation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(employeeInformation);
        expect(expectedResult).toContain(employeeInformation2);
      });

      it('should accept null and undefined values', () => {
        const employeeInformation: IEmployeeInformation = sampleWithRequiredData;
        expectedResult = service.addEmployeeInformationToCollectionIfMissing([], null, employeeInformation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(employeeInformation);
      });

      it('should return initial array if no EmployeeInformation is added', () => {
        const employeeInformationCollection: IEmployeeInformation[] = [sampleWithRequiredData];
        expectedResult = service.addEmployeeInformationToCollectionIfMissing(employeeInformationCollection, undefined, null);
        expect(expectedResult).toEqual(employeeInformationCollection);
      });
    });

    describe('compareEmployeeInformation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEmployeeInformation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEmployeeInformation(entity1, entity2);
        const compareResult2 = service.compareEmployeeInformation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEmployeeInformation(entity1, entity2);
        const compareResult2 = service.compareEmployeeInformation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEmployeeInformation(entity1, entity2);
        const compareResult2 = service.compareEmployeeInformation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
