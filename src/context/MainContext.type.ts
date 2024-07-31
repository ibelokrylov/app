import { EquipmentType } from '../lib/types/equipment.type';
import { ServiceType } from '../lib/types/service.type';

export type UserData = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  username: string;
  name: string;
  phone: string;
  rank: string;
  is_active: boolean;
  role: 'user' | 'admin' | 'superadmin';
  equipment_list?: {
    id: string;
    equipment: string[] | null;
  };
};
export type MainContextType = {
  user: {
    isAuth?: boolean;
    data: null | UserData;
  };
  users: UserData[] | null;
  setUsers: (data: UserData[] | null) => void;
  equipmentList: EquipmentType[] | null;
  setEquipmentList: (data: EquipmentType[] | null) => void;
  setUser: (data: UserData | null) => void;
  service: ServiceType[] | null;
  setService: (data: ServiceType[] | null) => void;
};
