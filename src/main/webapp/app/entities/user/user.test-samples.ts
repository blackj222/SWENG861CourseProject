import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 14414,
  login: 'gzKe',
};

export const sampleWithPartialData: IUser = {
  id: 823,
  login: '@TGI',
};

export const sampleWithFullData: IUser = {
  id: 25150,
  login: 'e@3B-aky\\OaA2lq\\JhRRB6N\\#aJ7',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
