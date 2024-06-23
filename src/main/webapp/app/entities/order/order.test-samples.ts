import dayjs from 'dayjs/esm';

import { IOrder, NewOrder } from './order.model';

export const sampleWithRequiredData: IOrder = {
  id: 31510,
  title: 'debase glory',
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2024-06-23T06:02'),
};

export const sampleWithPartialData: IOrder = {
  id: 13237,
  title: 'gah',
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2024-06-22T23:48'),
};

export const sampleWithFullData: IOrder = {
  id: 17069,
  title: 'failing for complement',
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2024-06-23T20:14'),
};

export const sampleWithNewData: NewOrder = {
  title: 'until oof woot',
  content: '../fake-data/blob/hipster.txt',
  date: dayjs('2024-06-23T13:45'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
