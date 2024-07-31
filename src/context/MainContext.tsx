import React from 'react';
import { MainContextType } from './MainContext.type';

export const MainContext = React.createContext<MainContextType>({
  user: {
    isAuth: undefined,
    data: null,
  },
  equipmentList: null,
  users: null,
  setUsers: () => {},
  setEquipmentList: () => {},
  setUser: () => {},
  service: null,
  setService: () => {},
});
