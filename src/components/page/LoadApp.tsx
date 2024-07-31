import { Box, Spinner } from '@chakra-ui/react';
import { useCallback, useContext, useEffect } from 'react';
import { MainContext } from '../../context/MainContext';
import { http } from '../../lib/http';

export const LoadApp = () => {
  const { setUser } = useContext(MainContext);
  const checkAuth = useCallback(async () => {
    const data = await http({ url: '/v1/user/profile' });
    setTimeout(() => {
      if (!data.error) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    checkAuth();
  });
  return (
    <Box
      width={'100vw'}
      height={'100vh'}
    >
      <Spinner
        position={'absolute'}
        left={'50%'}
        top={'50%'}
        size='xl'
      />
    </Box>
  );
};
