import { Button, Checkbox, Divider, FormControl, FormLabel, Input, Select, Switch, useToast } from '@chakra-ui/react';
import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { MainContext } from '../../context/MainContext';
import { UserData } from '../../context/MainContext.type';
import { http } from '../../lib/http';

type User = {
  name: string;
  phone: string;
  rank: string;
  username: string;
  password: string;
  cabinet_number: string;
  equipment_list: {
    equipment: string[];
  };
  role: 'user' | 'admin' | 'superadmin';
  id: string;
  is_active: boolean;
};

export const Route = createLazyFileRoute('/users/$id')({
  component: UserPage,
});

function UserPage() {
  const { id } = Route.useParams();
  const { users, equipmentList, setEquipmentList, user: userContext, setUsers } = useContext(MainContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!users) {
      navigate({
        to: '/users',
      });
    }
  }, [users]);

  const user = users?.find((user) => user.id === id);
  const [load, setLoad] = useState<boolean>(false);
  const [_user, setUser] = useState<User>({ ...user, password: '' } as User);
  const [change, setChange] = useState(false);

  const toast = useToast();

  const getEq = async () => {
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

  const sendUser = async () => {
    setLoad(true);
    const new_data = {
      id: _user.id,
      name: _user.name,
      phone: _user.phone,
      rank: _user.rank,
      role: _user.role,
      equipment: _user.equipment_list?.equipment,
      password: _user.password,
      is_active: _user.is_active,
      cabinet_number: _user.cabinet_number,
    };
    if (!_user.name.trim() || !_user.phone.trim() || !_user.rank.trim() || !_user.username.trim()) {
      toast({
        title: 'Заполните все поля',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoad(false);
      return;
    }

    if (new_data.password === '') {
      //@ts-ignore
      delete new_data.password;
    }

    const { error, data } = await http({ url: `/v1/admin/update/user/`, method: 'POST', body: new_data });
    if (error) {
      toast({
        title: 'Не удалось изменить пользователя',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Пользователь изменен',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      const new_users = users?.map((u) => {
        if (data.id === u.id) {
          return data;
        } else {
          return u;
        }
      });

      setUsers(new_users as UserData[]);
      navigate({ to: '/users' });
    }
    setLoad(false);
  };

  const addOrRemoveEquipment = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      _user &&
        setUser({ ..._user, equipment_list: { ..._user.equipment_list, equipment: [...(_user?.equipment_list?.equipment ?? []), id] } });
    } else {
      setUser({
        ..._user,
        equipment_list: { ..._user.equipment_list, equipment: (_user?.equipment_list?.equipment ?? []).filter((eq) => eq !== id) },
      });
    }
  };

  const deleteUser = async () => {
    const { error } = await http({ url: `/v1/admin/delete/user/`, method: 'POST', body: { id: _user.id } });
    if (!error) {
      const new_users = users?.filter((u) => u.id !== _user.id);
      setUsers(new_users as UserData[]);
      toast({
        title: 'Пользователь удален',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate({ to: '/users' });
    }
  };

  useEffect(() => {
    if (!equipmentList) {
      getEq();
    }
  }, [equipmentList]);

  return (
    <AdminLayout>
      {change ? (
        <div className={'flex flex-col gap-4 py-4 w-full'}>
          <h1 className={'text-2xl text-center'}>Изменить пользователя</h1>
          <Divider />
          <div className={'flex flex-col gap-1'}>
            <label htmlFor={'name'}>Имя</label>
            <Input
              id={'name'}
              value={_user?.name}
              name={'name'}
              onChange={(e) => setUser({ ..._user, name: e.target.value })}
            />
          </div>
          <div className={'flex flex-col gap-1'}>
            <label htmlFor={'phone'}>Телефон</label>
            <Input
              id={'phone'}
              value={_user.phone}
              name={'phone'}
              onChange={(e) => setUser({ ..._user, phone: e.target.value })}
            />
          </div>
          <div className={'flex flex-col gap-1'}>
            <label htmlFor={'rank'}>Должность:</label>
            <Input
              id={'rank'}
              value={_user.rank}
              name={'rank'}
              onChange={(e) => setUser({ ..._user, rank: e.target.value })}
            />
          </div>
          <div className={'flex flex-col gap-1'}>
            <label htmlFor={'rank'}>Кабинет:</label>
            <Input
              id={'rank'}
              value={_user.cabinet_number}
              name={'rank'}
              onChange={(e) => setUser({ ..._user, rank: e.target.value })}
            />
          </div>
          <div className={'flex flex-col gap-1'}>
            <label htmlFor={'role'}>Доступ:</label>
            <Select
              isDisabled={load}
              // @ts-ignore
              onChange={(e) => setUser({ ..._user, role: e.target.value })}
              placeholder='Выберите роль'
              value={_user.role}
            >
              {userContext.data?.role === 'superadmin' ? (
                <>
                  <option value='superadmin'>Супер-админ</option>
                  <option value='admin'>Админ</option>
                </>
              ) : null}
              <option value='user'>Пользователь</option>
            </Select>
          </div>
          <FormControl
            display='flex'
            alignItems='center'
          >
            <FormLabel
              htmlFor='email-alerts'
              mb='0'
            >
              Пользователь активен
            </FormLabel>
            <Switch
              id='email-alerts'
              defaultChecked={_user.is_active}
              onChange={(e) => setUser({ ..._user, is_active: e.target.checked })}
            />
          </FormControl>
          <div className={'flex flex-col gap-3'}>
            <label htmlFor={'equipment'}>Оборудование:</label>
            <div className={'flex gap-3 flex-wrap'}>
              {equipmentList
                ?.filter((eq) => eq.is_active)
                ?.map((eq) => {
                  return (
                    <div key={eq.id}>
                      <Checkbox
                        isDisabled={load}
                        onChange={(e) => addOrRemoveEquipment(eq.id, e)}
                        isChecked={_user?.equipment_list?.equipment?.includes(eq.id)}
                      >
                        {eq.name}
                      </Checkbox>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className={'flex flex-col gap-1'}>
            <label htmlFor={'password'}>Новый пароль:</label>
            <Input
              id={'password'}
              value={_user.password}
              name={'password'}
              type={'password'}
              onChange={(e) => setUser({ ..._user, name: e.target.value })}
            />
          </div>
          <div className={'flex justify-between'}>
            <div>
              <Button
                colorScheme={'blue'}
                onClick={sendUser}
              >
                Сохранить
              </Button>
            </div>
            <div>
              <Button onClick={() => setChange(false)}>Назад</Button>
            </div>
          </div>
          <div>
            <Button
              onClick={deleteUser}
              colorScheme={'red'}
            >
              Удалить
            </Button>
          </div>
        </div>
      ) : (
        <div className={'flex flex-col gap-4 py-4 w-full'}>
          <h1 className={'text-2xl text-center'}>Просмотр пользователя</h1>
          <Divider />
          <div className={'flex gap-2 flex-wrap w-full'}>
            <div className={'w-[49%] flex flex-col gap-1'}>
              <div>Логин: {user?.username}</div>
              <div>Доступы: {user?.role}</div>
              <div>Должность: {user?.rank}</div>
              <div>Имя: {user?.name}</div>
              <div>Телефон: {user?.phone}</div>
            </div>
            <div className={'w-[49%] flex flex-col gap-1'}>
              {!user?.deleted_at && <div>Активен: {user?.is_active ? 'Да' : 'Нет'}</div>}
              <div>Создан: {dayjs(user?.created_at).format('DD.MM.YYYY HH:mm')}</div>
              <div>Обновлен: {dayjs(user?.updated_at).format('DD.MM.YYYY HH:mm')}</div>
              {user?.deleted_at && <div>Удален: {user?.deleted_at}</div>}
            </div>
          </div>
          <div className={'flex flex-col gap-3'}>
            <h3>Доступное оборудование:</h3>
            {equipmentList && (
              <div className={'flex flex-col'}>
                {user?.equipment_list?.equipment?.map((eq) => {
                  return (
                    <Link
                      to={`/equipments/${eq}`}
                      key={eq}
                    >
                      <div>{equipmentList.find((e) => e.id === eq)?.name}</div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <div className={'flex justify-between'}>
            <div>
              <Button
                colorScheme={'blue'}
                onClick={() => setChange(true)}
              >
                Редактировать
              </Button>
            </div>
            <div>
              <Button
                onClick={() =>
                  navigate({
                    to: '/users',
                  })
                }
              >
                Назад
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
