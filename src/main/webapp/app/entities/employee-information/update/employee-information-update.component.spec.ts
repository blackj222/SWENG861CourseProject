import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { EmployeeInformationService } from '../service/employee-information.service';
import { IEmployeeInformation } from '../employee-information.model';
import { EmployeeInformationFormService } from './employee-information-form.service';

import { EmployeeInformationUpdateComponent } from './employee-information-update.component';

describe('EmployeeInformation Management Update Component', () => {
  let comp: EmployeeInformationUpdateComponent;
  let fixture: ComponentFixture<EmployeeInformationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let employeeInformationFormService: EmployeeInformationFormService;
  let employeeInformationService: EmployeeInformationService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, EmployeeInformationUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EmployeeInformationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmployeeInformationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    employeeInformationFormService = TestBed.inject(EmployeeInformationFormService);
    employeeInformationService = TestBed.inject(EmployeeInformationService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const employeeInformation: IEmployeeInformation = { id: 456 };
      const user: IUser = { id: 23768 };
      employeeInformation.user = user;

      const userCollection: IUser[] = [{ id: 15585 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employeeInformation });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const employeeInformation: IEmployeeInformation = { id: 456 };
      const user: IUser = { id: 24535 };
      employeeInformation.user = user;

      activatedRoute.data = of({ employeeInformation });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.employeeInformation).toEqual(employeeInformation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployeeInformation>>();
      const employeeInformation = { id: 123 };
      jest.spyOn(employeeInformationFormService, 'getEmployeeInformation').mockReturnValue(employeeInformation);
      jest.spyOn(employeeInformationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employeeInformation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employeeInformation }));
      saveSubject.complete();

      // THEN
      expect(employeeInformationFormService.getEmployeeInformation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(employeeInformationService.update).toHaveBeenCalledWith(expect.objectContaining(employeeInformation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployeeInformation>>();
      const employeeInformation = { id: 123 };
      jest.spyOn(employeeInformationFormService, 'getEmployeeInformation').mockReturnValue({ id: null });
      jest.spyOn(employeeInformationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employeeInformation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: employeeInformation }));
      saveSubject.complete();

      // THEN
      expect(employeeInformationFormService.getEmployeeInformation).toHaveBeenCalled();
      expect(employeeInformationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmployeeInformation>>();
      const employeeInformation = { id: 123 };
      jest.spyOn(employeeInformationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employeeInformation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(employeeInformationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
