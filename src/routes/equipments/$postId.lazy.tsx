import { Badge, Button, FormControl, FormLabel, Input, Switch, Tag, useToast } from '@chakra-ui/react';
import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { EquipListLayout } from '../../components/layout/EquipListLayout';
import { MainContext } from '../../context/MainContext';
import { http } from '../../lib/http';
import { EquipmentType } from '../../lib/types/equipment.type';

export const Route = createLazyFileRoute('/equipments/$postId')({
  component: EquipmentsPostId,
});

function EquipmentsPostId() {
  const { postId } = Route.useParams();
  const { equipmentList, user, setEquipmentList } = useContext(MainContext);
  const currentEquipment = equipmentList?.find((eq) => eq.id === postId);
  const [eq, setEq] = useState<EquipmentType | undefined>(currentEquipment);

  const navigate = useNavigate();

  useEffect(() => {
    if (equipmentList && !currentEquipment) {
      navigate({ to: '/equipments' });
    } else {
      if (currentEquipment?.id === eq?.id) {
        return;
      }
      setEq(currentEquipment);
    }
  }, [equipmentList]);

  const onChangeEq = (e: ChangeEvent<HTMLInputElement>) => {
    if (!eq) {
      return;
    }
    setEq({ ...eq, [e.target.name]: e.target.value });
  };

  const resetChange = () => {
    setEq(currentEquipment);
    setChange(false);
  };

  const toast = useToast();

  const onSendToServerAndValidate = async () => {
    if (!eq) {
      return;
    }
    if (!eq.name.trim() || eq.is_active === undefined) {
      toast({
        title: 'Заполните все поля',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    const dataSend: Partial<EquipmentType> = {};
    dataSend['name'] = eq.name;
    dataSend['is_active'] = eq.is_active;
    dataSend['id'] = currentEquipment?.id;

    const { data } = await http({
      url: `/v1/admin/update/equipment`,
      method: 'POST',
      body: dataSend,
    });
    if (data) {
      setChange(false);
      const newEQ = [...(equipmentList ?? [])].map((item) => {
        if (item.id === data.id) {
          return eq;
        }
        return item;
      });
      setEquipmentList(newEQ);
    }
  };

  const [change, setChange] = useState(false);

  return (
    <EquipListLayout>
      {change ? (
        <div className={'py-3 flex flex-col gap-4'}>
          <h1 className={'text-2xl text-center'}>Изменение оборудования</h1>
          <div className={'flex flex-col gap-2'}>
            <label htmlFor={'name'}>
              Название: <Badge>{currentEquipment?.name}</Badge>
            </label>
            <Input
              id={'name'}
              name={'name'}
              value={eq?.name}
              onChange={onChangeEq}
            />
          </div>
          <FormControl
            display='flex'
            alignItems='center'
          >
            <FormLabel
              htmlFor='email-alerts'
              mb='0'
            >
              Оборудование активно
            </FormLabel>
            <Switch
              id='email-alerts'
              defaultChecked={eq?.is_active}
              onChange={() => eq && setEq({ ...eq, is_active: !eq?.is_active })}
            />
          </FormControl>
          <div className={'flex justify-between'}>
            <div>
              <Button
                onClick={onSendToServerAndValidate}
                colorScheme={'green'}
              >
                Сохранить
              </Button>
            </div>
            <div>
              <Button
                onClick={resetChange}
                colorScheme={'gray'}
              >
                Отменить
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className={'py-3 flex flex-col gap-4'}>
          <h1 className={'text-2xl text-center'}>{eq?.name}</h1>
          <div className={'flex gap-2 flex-wrap justify-center'}>
            {eq?.deleted_at ? (
              <div>
                <Tag colorScheme={'red'}>Удален</Tag>
              </div>
            ) : (
              <div>
                <Tag colorScheme={eq?.is_active ? 'cyan' : 'red'}>{eq?.is_active ? 'Активен' : 'Не активен'}</Tag>
              </div>
            )}
          </div>
          <div>
            Дата создания: <Badge>{dayjs(eq?.created_at).format('DD.MM.YYYY HH:mm')}</Badge>
          </div>
          <div>
            Дата последнего изменения: <Badge>{dayjs(eq?.updated_at).format('DD.MM.YYYY HH:mm')}</Badge>
          </div>
          {eq?.deleted_at ? (
            <div>
              Дата удаления: <Badge>{dayjs(eq?.deleted_at).format('DD.MM.YYYY HH:mm')}</Badge>
            </div>
          ) : null}
          {user.data?.role === 'user' ? null : (
            <div className={'flex justify-between'}>
              <div>
                <Button
                  colorScheme={'blue'}
                  onClick={() => setChange(true)}
                >
                  Редактировать
                </Button>
              </div>
              <div>
                <Link to={'/equipments'}>
                  <Button>Назад</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </EquipListLayout>
  );
}
