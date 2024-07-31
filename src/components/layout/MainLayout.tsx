import { Container } from '@chakra-ui/react';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { PropsWithChildren } from 'react';
import { Navbar } from '../Navbar';

type Props = PropsWithChildren;

export const MainLayout = (props: Props) => {
  return (
    <>
      <Navbar />
      <Container
        maxW='2xl'
        centerContent
      >
        {props.children}
      </Container>
      <TanStackRouterDevtools />
    </>
  );
};
