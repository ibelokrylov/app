import { createLazyFileRoute } from '@tanstack/react-router';
import { AdminHomePage } from '../components/page/AdminHomePage';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  return <AdminHomePage />;
}
