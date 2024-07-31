import { Button, Divider, useToast } from '@chakra-ui/react';
import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { useContext, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { MainContext } from '../../context/MainContext';
import { http } from '../../lib/http';

export const Route = createLazyFileRoute('/users/')({
  component: Users,
});

function Users() {
  const { users, setUsers } = useContext(MainContext);
  const navigate = useNavigate();

  const toast = useToast();

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
    }
    if (data) {
      setUsers(data);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <AdminLayout>
      <div className={'flex flex-col gap-4 py-4 w-full'}>
        <h1 className={'text-2xl text-center'}>Пользователи</h1>
        <Divider />
        <div>
          <Button
            onClick={() =>
              navigate({
                to: '/users/create',
              })
            }
            colorScheme={'blue'}
          >
            Создать пользователя
          </Button>
        </div>
        {users?.map((user) => (
          <Link
            to={`/users/${user.id}`}
            key={user.id}
          >
            <div className={'w-full p-2 bg-white rounded-md shadow-md flex flex-row gap-2 items-center'}>
              <div className={'flex gap-2 flex-wrap w-full'}>
                <div className={'w-[49%] flex flex-col gap-1'}>
                  <div>Логин: {user.username}</div>
                  <div>Доступы: {user.role}</div>
                  <div>Должность: {user.rank}</div>
                  <div>Имя: {user.name}</div>
                  <div>Телефон: {user.phone}</div>
                </div>
                <div className={'w-[49%] flex flex-col gap-1'}>
                  {!user.deleted_at && <div>Активен: {user.is_active ? 'Да' : 'Нет'}</div>}
                  <div>Создан: {dayjs(user.created_at).format('DD.MM.YYYY HH:mm')}</div>
                  <div>Обновлен: {dayjs(user.updated_at).format('DD.MM.YYYY HH:mm')}</div>
                  {user.deleted_at && <div>Удален: {user.deleted_at}</div>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
