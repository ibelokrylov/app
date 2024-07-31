import { Button, Input, useToast } from '@chakra-ui/react';
import { ChangeEvent, useContext, useState } from 'react';
import { MainContext } from '../../context/MainContext';
import { http } from '../../lib/http';

export const Authenticated = () => {
  const { setUser: setUserContext } = useContext(MainContext);

  const [user, setUser] = useState({
    username: '',
    password: '',
  });

  const [load, setLoad] = useState(false);

  const toast = useToast();

  const onChangeUser = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const sendUser = async () => {
    setLoad(true);
    if (!user.username || !user.password) {
      toast({
        title: 'Заполните все поля',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoad(false);
      return;
    }
    const { data } = await http({ url: '/v1/login', method: 'POST', body: user });
    if (data) {
      toast({
        title: 'Успешная авторизация',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      localStorage.setItem('sid', data.sid);
      setUserContext(data.user);
    } else {
      toast({
        title: 'Неверные данные',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoad(false);
  };

  return (
    <div className={'flex flex-col gap-3'}>
      <h1 className={'text-2xl text-center'}>Авторизация</h1>
      <Input
        disabled={load}
        name={'username'}
        onChange={onChangeUser}
        placeholder={'Логин'}
      />
      <Input
        disabled={load}
        name={'password'}
        onChange={onChangeUser}
        placeholder={'Пароль'}
        type={'password'}
      />
      <Button
        isLoading={load}
        onClick={sendUser}
        colorScheme={'blue'}
      >
        Войти
      </Button>
    </div>
  );
};
