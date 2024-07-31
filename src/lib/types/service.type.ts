import { UserData } from '../../context/MainContext.type';

export type ServiceType = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_id: string;
  desc: string;
  status: 'pending' | 'active' | 'inactive' | 'success';
  equipment: string[] | null;
  user: UserData | null;
};
