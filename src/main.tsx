import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';
import { MainContextProvider } from './context/MainContext.provider';
import './main.css';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider>
    <MainContextProvider>
      <RouterProvider router={router} />
    </MainContextProvider>
  </ChakraProvider>
);
