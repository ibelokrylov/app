import { Button, Divider, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react';
import { Link, useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { MainContext } from '../../context/MainContext';
import { http } from '../../lib/http';
import { ServiceType } from '../../lib/types/service.type';

const labels = {
  pending: 'В обработке',
  active: 'Активные',
  inactive: 'Закрытые',
  success: 'Завершенные',
};

export const AdminHomePage = () => {
  const { setService, user } = useContext(MainContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [sortedService, setSortedService] = useState<Record<string, ServiceType[]>[]>([]);
  const getAllService = async () => {
    const url = user.data?.role === 'user' ? '/v1/user/service' : '/v1/admin/service';
    const { data, error } = await http({ url: url });
    if (error) {
      toast({
        title: 'Не удалось получить заявки',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      setService(data);
      const sort = data.reduce(
        (acc: Record<string, ServiceType[]>, item: ServiceType) => {
          if (acc[item.status]) {
            acc[item.status].push(item);
          } else {
            acc[item.status] = [item];
          }
          return acc;
        },
        [] as Record<string, ServiceType[]>[]
      );

      setSortedService(sort);
    }
  };

  useEffect(() => {
    getAllService();
  }, []);

  const Item = ({ item }: { item: ServiceType }) => {
    return (
      <Link to={`/service/${item.id}`}>
        <div className={'w-full p-2 bg-white rounded-md shadow-md flex flex-wrap gap-2'}>
          {user.data?.role !== 'user' && (
            <div className={'flex flex-col gap-1 w-[49%]'}>
              <div>{item.user?.name}</div>
              <div>{item.user?.rank}</div>
              <div>{item.user?.phone}</div>
            </div>
          )}
          <div className={'flex flex-col gap-1' + (user.data?.role !== 'user' ? ' w-[49%]' : '')}>
            <div>{item.desc}</div>
            <div>
              Дата создания: <div>{dayjs(item.created_at).format('DD.MM.YYYY HH:mm')}</div>
            </div>
            <div>
              Последнее обновление: <div>{dayjs(item.updated_at).format('DD.MM.YYYY HH:mm')}</div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className={'flex flex-col gap-4 py-4 w-full'}>
      <h1 className={'text-2xl text-center'}>Заявки</h1>
      <Divider />
      <div>
        <Button
          onClick={() => navigate({ to: '/service/create' })}
          colorScheme={'blue'}
        >
          Создать заявку
        </Button>
      </div>
      <Tabs>
        <TabList>
          {Object.keys(labels).map((key) => (
            <Tab key={key}>{labels[key as keyof typeof labels]}</Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel>
            <div className={'flex flex-col gap-3'}>
              {/* @ts-ignore */}
              {sortedService?.pending?.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div className={'flex flex-col gap-3'}>
              {/* @ts-ignore */}
              {sortedService?.active?.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div className={'flex flex-col gap-3'}>
              {/* @ts-ignore */}
              {sortedService?.inactive?.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div className={'flex flex-col gap-3'}>
              {/* @ts-ignore */}
              {sortedService?.success?.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};
