import { IUser } from 'app/entities/user/user.model';

export interface IEmployeeInformation {
  id: number;
  name?: string | null;
  handle?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewEmployeeInformation = Omit<IEmployeeInformation, 'id'> & { id: null };
