import { Button, Divider, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { http } from '../../lib/http';

export const Route = createLazyFileRoute('/equipments/creaet')({
  component: CreatePage,
});

function CreatePage() {
  const [name, setName] = useState<string>('');
  const [load, setLoad] = useState<boolean>(false);

  const toast = useToast();

  const onSendName = async () => {
    setLoad(true);
    if (!name) {
      toast({
        title: 'Заполните все поля',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setLoad(false);
      return;
    }

    const { error } = await http({ url: '/v1/admin/create/equipment', method: 'POST', body: { name } });
    if (error) {
      toast({
        title: 'Не удалось создать оборудование',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Оборудование создано',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setName('');
    }
    setLoad(false);
  };

  const navigate = useNavigate();

  return (
    <div className={'p-2 flex flex-col gap-4 w-full'}>
      <h1 className={'text-2xl text-center'}>Создать оборудование</h1>
      <Divider />
      <div>
        <FormControl alignItems='center'>
          <FormLabel
            htmlFor='email-alerts'
            mb='0'
          >
            Название оборудования
          </FormLabel>
          <Input
            value={name}
            id={'email-alerts'}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
      </div>
      <div className={'flex flex-wrap justify-between'}>
        <div>
          <Button
            isLoading={load}
            disabled={!name}
            colorScheme={'blue'}
            onClick={onSendName}
          >
            Создать
          </Button>
        </div>
        <div>
          <Button
            isLoading={load}
            disabled={!name}
            onClick={() =>
              navigate({
                to: '/equipments',
              })
            }
          >
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
}
