import { useNavigate } from '@tanstack/react-router';
import { PropsWithChildren, useContext } from 'react';
import { MainContext } from '../../context/MainContext';

export const AdminLayout = (props: PropsWithChildren) => {
  const navigate = useNavigate();
  const { user } = useContext(MainContext);
  if (user.data?.role === 'user') {
    navigate({ to: '/' });
  }
  return <>{props.children}</>;
};
