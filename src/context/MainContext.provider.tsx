import { useState } from 'react';
import { EquipmentType } from '../lib/types/equipment.type';
import { ServiceType } from '../lib/types/service.type';
import { MainContext } from './MainContext';
import { UserData } from './MainContext.type';

export const MainContextProvider = (props: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuth, setIsAuth] = useState<boolean | undefined>(undefined);
  const [equipmentList, setEquipmentList] = useState<EquipmentType[] | null>(null);
  const [users, setUsers] = useState<UserData[] | null>(null);
  const [service, setService] = useState<ServiceType[] | null>(null);

  const onUserChange = (data: UserData | null) => {
    if (data === null) {
      setIsAuth(false);
      setUser(null);
      setEquipmentList(null);
      setUsers(null);
    } else {
      setUser(data);
      setIsAuth(true);
    }
  };
  return (
    <MainContext.Provider
      value={{
        user: {
          isAuth,
          data: user,
        },
        setUser: onUserChange,
        equipmentList,
        setEquipmentList,
        users,
        setUsers,
        setService,
        service,
      }}
    >
      {props.children}
    </MainContext.Provider>
  );
};
