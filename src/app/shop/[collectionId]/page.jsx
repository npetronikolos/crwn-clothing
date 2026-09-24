import { notFound } from 'next/navigation';
import { query } from '@/lib/apollo-server';
import { GET_COLLECTION } from '@/graphql/operations';
import CollectionPage from './collection.component';

export const dynamic = 'force-dynamic';

const getCollection = async routeName => {
  const { data } = await query({ query: GET_COLLECTION, variables: { routeName } });
  return data.collection;
};

export const generateMetadata = async ({ params }) => {
  const collection = await getCollection((await params).collectionId);
  return { title: collection ? `${collection.title} | CRWN Clothing` : 'CRWN Clothing' };
};

const CollectionRoute = async ({ params }) => {
  const collection = await getCollection((await params).collectionId);
  if (!collection) notFound();

  return <CollectionPage collection={collection} />;
};

export default CollectionRoute;
