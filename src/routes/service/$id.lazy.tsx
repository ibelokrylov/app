import { Badge, Button, Checkbox, Divider, Radio, RadioGroup, Tag, Textarea, useToast } from '@chakra-ui/react';
import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import { MainContext } from '../../context/MainContext';
import { generateIdHelper } from '../../lib/generateId.helper';
import { http } from '../../lib/http';
import { ServiceType } from '../../lib/types/service.type';

const labelsStatus = {
  pending: 'В обработке',
  active: 'Активные',
  inactive: 'Закрытые',
  success: 'Завершенные',
};

export const Route = createLazyFileRoute('/service/$id')({
  component: Service,
});

const labels = {
  id: 'id',
  created_at: 'Дата создания',
  updated_at: 'Дата обновления',
  desc: 'Описание',
  status: 'Статус',
  equipment: 'Оборудование',
  user: 'Пользователь',
};
const status = {
  pending: 'В обработке',
  active: 'Активные',
  inactive: 'Закрытые',
  success: 'Завершенные',
};

const badgeColor = {
  pending: 'yellow',
  active: 'green',
  inactive: 'red',
  success: 'blue',
};

function Service() {
  const { id } = Route.useParams();

  const { service, equipmentList, setEquipmentList, user } = useContext(MainContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState<ServiceType | null>(null);
  const [edit, setEdit] = useState(false);
  console.log('🚀 ~ Service ~ serviceData:', serviceData);

  const _edit = useMemo(() => {
    return edit;
  }, [edit]);

  const getAllEquipment = async () => {
    const { data, error } = await http({ url: '/v1/user/all/equipment' });
    if (!error) {
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
    if (!service) {
      navigate({
        to: '/',
      });
    } else {
      if (!equipmentList) {
        getAllEquipment();
      }

      const find = service.find((item) => item.id === id);
      if (find) {
        setServiceData(find);
      } else {
        navigate({
          to: '/',
        });
      }
    }
  }, [service, equipmentList]);

  const cancel = () => {
    const serv = service?.find((item) => item.id === id);
    if (serv) {
      setServiceData(serv);
    }
    setEdit(false);
  };

  const update = async () => {
    const upd = {
      id: serviceData?.id ?? '',
      desc: serviceData?.desc ?? '',
      status: serviceData?.status ?? 'pending',
      equipment: serviceData?.equipment ?? [],
    };

    if (!upd.desc) {
      toast({
        title: 'Заполните описание',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (upd.equipment?.length === 0) {
      toast({
        title: 'Не выбрано оборудование',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const { error } = await http({
      url: '/v1/user/update/service',
      method: 'POST',
      body: upd,
    });

    if (!error) {
      toast({
        title: 'Заявка обновлена',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setEdit(false);
    }

    if (error) {
      toast({
        title: 'Не удалось обновить заявку',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const addOrRemoveEquipment = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      //@ts-ignore
      setServiceData({ ...serviceData, equipment: [...serviceData?.equipment, id] });
    } else {
      //@ts-ignore
      setServiceData({ ...serviceData, equipment: serviceData?.equipment?.filter((eq) => eq !== id) });
    }
  };

  return (
    <div className={'flex flex-col gap-4 py-4 w-full'}>
      <h1 className={'text-2xl text-center'}>Заявка</h1>
      <Divider />
      {serviceData &&
        Object.keys(labels).map((key) => {
          if (key === 'equipment') {
            return (
              <div
                className={'flex flex-col gap-2'}
                key={generateIdHelper()}
              >
                <div>{labels[key]}:</div>
                <div className={'flex flex-row gap-2'}>
                  {edit ? (
                    <div className={'flex flex-wrap gap-2'}>
                      {serviceData.user?.equipment_list?.equipment?.map((item) => {
                        return (
                          <div key={generateIdHelper()}>
                            <Checkbox
                              onChange={(e) => addOrRemoveEquipment(item, e)}
                              isChecked={serviceData.equipment?.includes(item)}
                            >
                              {equipmentList?.find((eq) => eq.id === item)?.name}
                            </Checkbox>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    serviceData[key]?.map((item) => {
                      return (
                        <Link
                          to={`/equipments/${item}`}
                          key={generateIdHelper()}
                        >
                          <Tag>{equipmentList?.find((eq) => eq.id === item)?.name}</Tag>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            );
          }
          if (key === 'user') {
            return (
              <div
                className={'flex flex-col gap-2'}
                key={generateIdHelper()}
              >
                <Divider />
                <div>Пользователь: {serviceData[key]?.name}</div>
                <div>Должность: {serviceData[key]?.rank}</div>
                <div>Телефон: {serviceData[key]?.phone}</div>
              </div>
            );
          }
          if (key === 'status') {
            if (_edit) {
              return (
                <RadioGroup
                  onChange={(e) => setServiceData({ ...serviceData, status: e as 'pending' | 'active' | 'inactive' | 'success' })}
                  value={serviceData.status}
                >
                  <div className={'flex flex-row gap-2'}>
                    {Object.keys(labelsStatus).map((item) => {
                      return (
                        <Radio
                          key={item}
                          value={item}
                        >
                          {/* @ts-ignore */}
                          {labelsStatus[item]}
                        </Radio>
                      );
                    })}
                  </div>
                </RadioGroup>
              );
            }
            // @ts-ignore
            return (
              <div key={generateIdHelper()}>
                Статус: <Badge colorScheme={badgeColor[serviceData[key]]}>{status[serviceData[key]]}</Badge>
              </div>
            );
          }
          if (key === 'created_at' || key === 'updated_at') {
            return (
              <div key={generateIdHelper()}>
                {labels[key]}: {dayjs(serviceData[key]).format('DD.MM.YYYY HH:mm')}
              </div>
            );
          }
          if (key === 'desc') {
            if (_edit) {
              return (
                <div key={key}>
                  <Textarea
                    value={serviceData.desc}
                    onChange={(e) => setServiceData({ ...serviceData, desc: e.target.value })}
                  />
                </div>
              );
            }
            return (
              <div key={generateIdHelper()}>
                {/* @ts-ignore */}
                {labels[key]}: {serviceData[key]}
              </div>
            );
          }
          return (
            <div key={generateIdHelper()}>
              {/* @ts-ignore */}
              {labels[key]}: {serviceData[key]}
            </div>
          );
        })}
      <div className={'flex flex-row justify-between'}>
        {edit ? (
          <>
            <div>
              <Button
                colorScheme={'green'}
                onClick={update}
              >
                Сохранить
              </Button>
            </div>
            <div>
              <Button onClick={cancel}>Отменить изменения</Button>
            </div>
          </>
        ) : (
          <>
            {user.data?.role !== 'user' && (
              <div>
                <Button
                  colorScheme={'blue'}
                  onClick={() => setEdit(true)}
                >
                  Редактировать
                </Button>
              </div>
            )}
            <div>
              <Button onClick={() => navigate({ to: '/' })}>Назад</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
