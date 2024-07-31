import { Box, Container } from '@chakra-ui/react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useContext } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Authenticated } from '../components/page/Authenticated';
import { LoadApp } from '../components/page/LoadApp';
import { MainContext } from '../context/MainContext';

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const {
    user: { isAuth },
  } = useContext(MainContext);

  if (isAuth === undefined) {
    return (
      <Container centerContent>
        <LoadApp />
      </Container>
    );
  }
  if (isAuth === false) {
    return (
      <Container centerContent>
        <Box className={'pt-40'}>
          <Authenticated />
        </Box>
      </Container>
    );
  }
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
