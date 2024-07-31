import { Container } from '@chakra-ui/react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';
import { MainContext } from '../context/MainContext';
import { http } from '../lib/http';

export const Navbar = () => {
  const { user, setUser } = useContext(MainContext);

  const navigate = useNavigate();

  const baseLinks = [
    {
      to: '/',
      name: 'Заявки',
    },
  ];

  const links: {
    to: string;
    name: string;
  }[] =
    user.data?.role === 'user'
      ? [...baseLinks, { to: '/profile', name: 'Профиль' }]
      : [
          ...baseLinks,
          {
            to: '/equipments',
            name: 'Оборудование',
          },
          {
            to: '/users',
            name: 'Пользователи',
          },
        ];

  const logout = async () => {
    const { data } = await http({
      url: '/v1/user/logout',
      method: 'POST',
    });

    if (!data) {
      setUser(null);
      window.localStorage.clear();
      navigate({
        to: '/',
      });
    }
  };

  return (
    <>
      <Container
        maxW='2xl'
        centerContent
      >
        <div className='p-2 flex gap-2'>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className='[&.active]:font-bold px-3 py-2'
            >
              {link.name}
            </Link>
          ))}
          <a
            onClick={logout}
            href={'#'}
            className='[&.active]:font-bold px-3 py-2'
          >
            Выйти
          </a>
        </div>
      </Container>
      <hr />
    </>
  );
};
