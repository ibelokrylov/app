import { Button, Checkbox, Divider, Input, Select, useToast } from '@chakra-ui/react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { MainContext } from '../../context/MainContext';
import { http } from '../../lib/http';

export const Route = createLazyFileRoute('/users/create')({
  component: CreateUserPage,
});

type User = {
  name: string;
  phone: string;
  rank: string;
  username: string;
  password: string;
  password_confirm: string;
  equipment: string[];
  cabinet_number: string;
  role: 'user' | 'admin' | 'superadmin';
};

const initialState: User = {
  username: '',
  password: '',
  password_confirm: '',
  name: '',
  phone: '',
  rank: '',
  cabinet_number: '',
  equipment: [],
  role: 'user',
};

const labels = {
  name: 'Имя:',
  phone: 'Телефон:',
  rank: 'Должность:',
  cabinet_number: 'Кабинет:',
  username: 'Логин:',
  password: 'Пароль:',
  password_confirm: 'Подтвердите пароль:',
  equipment: 'Оборудование:',
  role: 'Роль:',
};

function CreateUserPage() {
  const { equipmentList, user: userContext, setEquipmentList } = useContext(MainContext);

  const [user, setUser] = useState<User>(initialState);
  const [load, setLoad] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();

  const getAllEquipment = async () => {
    const { data, error } = await http({ url: '/v1/user/all/equipment' });
    if (!error) {
      setEquipmentList(data);
    } else {
      useToast({
        title: 'Не удалось получить оборудование',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const sendUser = async () => {
    setLoad(true);

    if (user.password !== user.password_confirm) {
      toast({
        title: 'Пароли не совпадают',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoad(false);
      return;
    }

    if (!user.name.trim() || !user.phone.trim() || !user.rank.trim() || !user.username.trim() || !user.password.trim()) {
      toast({
        title: 'Заполните все поля',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoad(false);
      return;
    }
    const { error } = await http({ url: '/v1/admin/create/user', method: 'POST', body: user });
    if (error) {
      toast({
        title: 'Не удалось создать пользователя',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Пользователь создан',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setUser(initialState);
    }
    setLoad(false);
  };

  useEffect(() => {
    getAllEquipment();
  }, []);

  const onChangeTextData = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const addOrRemoveEquipment = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setUser({ ...user, equipment: [...user.equipment, id] });
    } else {
      setUser({ ...user, equipment: user.equipment.filter((eq) => eq !== id) });
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <AdminLayout>
      <div className={'flex flex-col gap-4 py-4 w-full'}>
        <h1 className={'text-2xl text-center'}>Создание пользователя</h1>
        <Divider />
        {Object.keys(user).map((key) => {
          switch (key) {
            case 'equipment':
              return (
                <div
                  className={'flex flex-col gap-3'}
                  key={key}
                >
                  <label htmlFor={key}>Оборудование:</label>
                  <div className={'flex gap-3 flex-wrap'}>
                    {equipmentList?.map((eq) => {
                      return (
                        <div key={eq.id}>
                          <Checkbox
                            isDisabled={load}
                            onChange={(e) => addOrRemoveEquipment(eq.id, e)}
                            isChecked={user.equipment.includes(eq.id)}
                          >
                            {eq.name}
                          </Checkbox>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            case 'role':
              return (
                <div key={key}>
                  <label htmlFor={key}>{labels[key]}</label>
                  <Select
                    isDisabled={load}
                    onChange={(e) => setUser({ ...user, role: e.target.value as User['role'] })}
                    placeholder='Выберите роль'
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
              );
            default:
              return (
                <div key={key}>
                  {/* @ts-ignore */}
                  <label htmlFor={key}>{labels[key]}</label>
                  <Input
                    isDisabled={load}
                    id={key}
                    // @ts-ignore
                    value={user[key] as string}
                    name={key}
                    onChange={onChangeTextData}
                    type={key === 'password' || key === 'password_confirm' ? 'password' : 'text'}
                  />
                  {key === 'password_confirm' ? <Divider className={'w-full py-3'} /> : null}
                </div>
              );
          }
        })}
        <div className={'flex justify-between'}>
          <div>
            <Button
              isLoading={load}
              onClick={sendUser}
              colorScheme={'blue'}
            >
              Сохранить
            </Button>
          </div>
          <div>
            <Button
              isLoading={load}
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
    </AdminLayout>
  );
}
