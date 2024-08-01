import { Divider, Tag, useToast } from '@chakra-ui/react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useContext, useEffect } from 'react';
import { MainContext } from '../context/MainContext';
import { http } from '../lib/http';

export const Route = createLazyFileRoute('/profile')({
  component: ProfileLazy,
});

function ProfileLazy() {
  const { user, equipmentList, setEquipmentList } = useContext(MainContext);
  const toast = useToast();

  const getAllEquipment = async () => {
    const { data, error } = await http({ url: '/v1/user/all/equipment' });
    if (!error) {
      setEquipmentList(data);
    } else {
      toast({
        title: 'Не удалось получить оборудование',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (!equipmentList) {
      getAllEquipment();
    }
  }, [equipmentList]);

  return (
    <div className={'flex flex-col gap-4 py-4 w-full'}>
      <h1 className={'text-2xl text-center'}>Профиль</h1>
      <Divider />
      <div>
        Логин: <Tag>{user.data?.username}</Tag>
      </div>
      <div>Имя: {user.data?.name}</div>
      <div>Должность: {user.data?.rank}</div>
      <div>
        Кабинет: <Tag>{user.data?.cabinet_number}</Tag>
      </div>
      <div>Телефон: {user.data?.phone}</div>
      <div>
        Статус: <Tag colorScheme={user.data?.is_active ? 'cyan' : 'red'}>{user.data?.is_active ? 'Активен' : 'Не активен'}</Tag>
      </div>
      <div className={'flex flex-col gap-3'}>
        <div>Список оборудования (доступного):</div>
        <div className={'flex flex-row gap-3'}>
          {user.data?.equipment_list?.equipment?.map((eq) => {
            return (
              <div key={eq}>
                <Tag>{equipmentList?.find((el) => el.id === eq)?.name}</Tag>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
