import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '433679b5-38dd-4a1b-b558-abbbe1455de7',
};

export const sampleWithPartialData: IAuthority = {
  name: 'c06cb551-af90-4f34-a208-cbf07236b579',
};

export const sampleWithFullData: IAuthority = {
  name: '312d638c-c6b4-48d9-bbc1-36bb09a63664',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
