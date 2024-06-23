import dayjs from 'dayjs/esm';
import { IEmployeeInformation } from 'app/entities/employee-information/employee-information.model';

export interface IOrder {
  id: number;
  title?: string | null;
  content?: string | null;
  date?: dayjs.Dayjs | null;
  employeeInformation?: IEmployeeInformation | null;
}

export type NewOrder = Omit<IOrder, 'id'> & { id: null };
