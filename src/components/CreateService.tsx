import { Button, Checkbox, Divider, Input, Select, useToast } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { MainContext } from '../context/MainContext';
import { UserData } from '../context/MainContext.type';
import { http } from '../lib/http';

const labels = {
  equipment: 'Оборудование',
  desc: 'Описание',
  user_id: 'Пользователь',
};

export const CreateService = () => {
  const toast = useToast();
  const { user, users, setUsers, equipmentList, setEquipmentList } = useContext(MainContext);
  const [service, setService] = useState<{
    user_id: string;
    desc: string;
    equipment: string[];
  }>({
    user_id: user.data?.role === 'user' ? (user.data?.id ?? '') : '',
    desc: '',
    equipment: [],
  });

  const getAllUsers = async () => {
    const { data, error } = await http({
      url: '/v1/admin/users',
    });
    if (error) {
      toast({
        title: 'Не удалось получить пользователей',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      const res = data.filter((user: UserData) => user.role === 'user' && user.is_active && user.deleted_at === null);
      setUsers(res);
    }
  };

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
    if (!users && user.data?.role !== 'user') {
      getAllUsers();
    }

    if (!equipmentList) {
      getAllEquipment();
    }
  }, [users]);

  const addOrRemoveEquipment = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setService({ ...service, equipment: [...service.equipment, id] });
    } else {
      setService({ ...service, equipment: service.equipment.filter((eq) => eq !== id) });
    }
  };

  const createService = async () => {
    if (!service.user_id) {
      toast({
        title: 'Не выбран пользователь',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!service.desc) {
      toast({
        title: 'Не заполнено описание',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (service.equipment.length === 0) {
      toast({
        title: 'Не выбрано оборудование',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    let url = '/v1/admin/create/service';
    if (user.data?.role === 'user') {
      url = '/v1/user/service';
    }
    const { error } = await http({
      url,
      method: 'POST',
      body: service,
    });
    if (error) {
      toast({
        title: 'Не удалось создать заявку',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Заявка создана',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate({ to: '/' });
    }
  };

  const isDisabled = service.user_id === '' || service.desc === '' || service.equipment.length === 0;

  const navigate = useNavigate();
  return (
    <div className={'flex flex-col gap-4 py-4 w-full'}>
      <h1 className={'text-2xl text-center'}>Создание заявки</h1>
      <Divider />
      {Object.keys(service).map((key) => {
        if (key === 'user_id') {
          return (
            <div key={key}>
              {/* @ts-ignore */}
              <label htmlFor={key}>{labels[key]}</label>
              <Select
                value={user.data?.role === 'user' ? user.data?.id : undefined}
                placeholder='Выберите'
                isDisabled={user.data?.role === 'user'}
                onChange={(e) => setService({ ...service, [key]: e.target.value })}
              >
                {user.data?.role === 'user' ? (
                  <>
                    <option value={user.data.id}>
                      {user.data.name} | {user.data.rank} | {user.data.phone}
                    </option>
                  </>
                ) : (
                  <>
                    {users?.map((user) => (
                      <option
                        key={user.id}
                        value={user.id}
                      >
                        {user.name} | {user.rank} | {user.phone}
                      </option>
                    ))}
                  </>
                )}
              </Select>
            </div>
          );
        }
        if (key === 'equipment') {
          if (service.user_id) {
            if (user.data?.role === 'user') {
              const eq_user = user.data.equipment_list?.equipment ?? [];
              const eq = equipmentList?.filter((eq) => eq_user.includes(eq.id) && eq.is_active);
              return (
                <div key={key}>
                  <label htmlFor={key}>{labels[key]}:</label>
                  {eq?.map((equipment) => {
                    return (
                      <div key={equipment.id}>
                        <Checkbox
                          onChange={(e) => addOrRemoveEquipment(equipment.id, e)}
                          isChecked={service.equipment.includes(equipment.id)}
                        >
                          {equipment.name}
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
              );
            } else {
              const _userSelect = users?.find((user) => user.id === service.user_id);
              const eq = equipmentList?.filter((eq) => _userSelect?.equipment_list?.equipment?.includes(eq.id));
              if (_userSelect) {
                return (
                  <div key={key}>
                    <label htmlFor={key}>{labels[key]}:</label>
                    {eq?.map((equipment) => {
                      return (
                        <div key={equipment.id}>
                          <Checkbox
                            onChange={(e) => addOrRemoveEquipment(equipment.id, e)}
                            isChecked={service.equipment.includes(equipment.id)}
                          >
                            {equipment.name}
                          </Checkbox>
                        </div>
                      );
                    })}
                  </div>
                );
              }
            }
          }
          return (
            <div key={key}>
              <label htmlFor={key}>{labels[key]}:</label>
              <div>Выберите пользователя</div>
            </div>
          );
        }
        return (
          <div key={key}>
            {/* @ts-ignore */}
            <label htmlFor={key}>{labels[key]}</label>
            <Input
              isDisabled={key === 'user_id' && user.data?.role === 'user'}
              id={key}
              name={key}
              // @ts-ignore
              value={service[key]}
              onChange={(e) => {
                setService({ ...service, [e.target.name]: e.target.value });
              }}
            />
          </div>
        );
      })}
      <div className={'flex justify-between'}>
        <div>
          <Button
            isDisabled={isDisabled}
            onClick={createService}
            colorScheme={'blue'}
          >
            Создать
          </Button>
        </div>
        <div>
          <Button onClick={() => navigate({ to: '/' })}>Назад</Button>
        </div>
      </div>
    </div>
  );
};
