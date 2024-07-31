import { createLazyFileRoute } from '@tanstack/react-router';
import { CreateService } from '../../components/CreateService';

export const Route = createLazyFileRoute('/service/create')({
  component: CreateLazy,
});

function CreateLazy() {
  return <CreateService />;
}
