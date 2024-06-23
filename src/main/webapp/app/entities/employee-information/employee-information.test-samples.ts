import { IEmployeeInformation, NewEmployeeInformation } from './employee-information.model';

export const sampleWithRequiredData: IEmployeeInformation = {
  id: 26194,
  name: 'shoemaker millisecond smoke',
  handle: 'hence margarine after',
};

export const sampleWithPartialData: IEmployeeInformation = {
  id: 2058,
  name: 'juxtapose before whereas',
  handle: 'whoever boo',
};

export const sampleWithFullData: IEmployeeInformation = {
  id: 8801,
  name: 'kielbasa diaper',
  handle: 'glum',
};

export const sampleWithNewData: NewEmployeeInformation = {
  name: 'astrakhan',
  handle: 'lazily',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
