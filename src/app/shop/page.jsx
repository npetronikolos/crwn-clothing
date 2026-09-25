import CollectionsOverview from '@/components/collections-overview/collections-overview.component';
import { query } from '@/lib/apollo-server';
import { GET_COLLECTIONS } from '@/graphql/operations';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Shop | CRWN Clothing' };

const ShopPage = async () => {
  const { data } = await query({ query: GET_COLLECTIONS });

  return (
    <div className='shop-page'>
      <CollectionsOverview collections={data.collections} />
    </div>
  );
};

export default ShopPage;
