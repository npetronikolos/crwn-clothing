import { query } from '@/lib/apollo-server';
import { GET_SECTIONS } from '@/graphql/operations';
import HomePage from './homepage.component';

export const dynamic = 'force-dynamic';

const HomeRoute = async () => {
  const { data } = await query({ query: GET_SECTIONS });

  return <HomePage sections={data.sections} />;
};

export default HomeRoute;
