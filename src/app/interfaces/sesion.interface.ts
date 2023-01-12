import { Admin } from './admin.interface';
import { Contractor } from './contractor.interface';

export interface Session {
  user: Admin | Contractor | null;
  state: string;
  message: string;
  userType: string | null;
}
