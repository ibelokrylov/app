import { Button, Divider, Tag } from '@chakra-ui/react';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { useContext } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { EquipListLayout } from '../../components/layout/EquipListLayout';
import { MainContext } from '../../context/MainContext';

export const Route = createLazyFileRoute('/equipments/')({
  component: EquipmentsLazy,
});

function EquipmentsLazy() {
  const { equipmentList } = useContext(MainContext);

  return (
    <AdminLayout>
      <EquipListLayout>
        <div className='py-4 w-full flex flex-col gap-[12px]'>
          <h1 className={'text-2xl text-center'}>Оборудование</h1>
          <Divider />
          <Link to={'/equipments/creaet'}>
            <Button colorScheme={'blue'}>Создать оборудование</Button>
          </Link>
          {equipmentList?.map((eq) => {
            return (
              <Link
                to={`/equipments/${eq.id}`}
                key={eq.id}
              >
                <div className={'w-full p-2 bg-white rounded-md shadow-md flex flex-row gap-2 items-center'}>
                  <div className={'flex flex-col gap-3'}>
                    <div>{eq.name}</div>
                    <div className={'flex flex-col flex-wrap gap-2'}>
                      {eq.deleted_at ? (
                        <div>
                          <Tag colorScheme={'red'}>Удален</Tag>
                        </div>
                      ) : (
                        <div>
                          <Tag colorScheme={eq.is_active ? 'cyan' : 'red'}>{eq.is_active ? 'Активен' : 'Не активен'}</Tag>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </EquipListLayout>
    </AdminLayout>
  );
}
