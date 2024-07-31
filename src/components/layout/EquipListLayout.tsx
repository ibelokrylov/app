import { useToast } from '@chakra-ui/react';
import { PropsWithChildren, useContext, useEffect } from 'react';
import { MainContext } from '../../context/MainContext';
import { http } from '../../lib/http';

export const EquipListLayout = (props: PropsWithChildren) => {
  const toast = useToast();
  const { setEquipmentList } = useContext(MainContext);

  const getAllEquipment = async () => {
    const { data } = await http({ url: '/v1/user/all/equipment' });

    if (data) {
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

  useEffect(() => {
    getAllEquipment();
  }, []);
  return <>{props.children}</>;
};
