import { createSchema } from 'graphql-yoga';
import { GraphQLError } from 'graphql';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma.js';

const typeDefs = /* GraphQL */ `
  type Item {
    id: ID!
    name: String!
    price: Float!
    imageUrl: String!
  }

  type Collection {
    id: ID!
    title: String!
    routeName: String!
    items: [Item!]!
  }

  type Section {
    id: ID!
    title: String!
    imageUrl: String!
    size: String
    linkUrl: String!
  }

  type PaymentIntent {
    clientSecret: String!
    amount: Int!
  }

  input CartItemInput {
    id: ID!
    quantity: Int!
  }

  type Query {
    sections: [Section!]!
    collections: [Collection!]!
    collection(routeName: String!): Collection
  }

  type Mutation {
    createPaymentIntent(items: [CartItemInput!]!): PaymentIntent!
  }
`;

const MAX_QUANTITY = 99;

const badInput = message => new GraphQLError(message, { extensions: { code: 'BAD_USER_INPUT' } });

const withItems = { items: { orderBy: { id: 'asc' } } };

// Prices come from the database, never from the client, so the charged amount can't be tampered with.
export const calculateAmountInCents = (catalogueItems, cartItems) => {
  const prices = new Map(catalogueItems.map(item => [String(item.id), item.priceInCents]));

  return cartItems.reduce((sum, { id, quantity }) => {
    const priceInCents = prices.get(String(id));
    if (priceInCents === undefined) throw badInput(`Unknown item: ${id}`);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw badInput(`Invalid quantity for item ${id}`);
    }
    return sum + priceInCents * quantity;
  }, 0);
};

let stripe;
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new GraphQLError('Payments are not configured: set STRIPE_SECRET_KEY.');
  }
  stripe ??= new Stripe(secretKey);
  return stripe;
};

export const resolvers = {
  Query: {
    sections: () => prisma.section.findMany({ orderBy: { id: 'asc' } }),
    collections: () => prisma.collection.findMany({ orderBy: { id: 'asc' }, include: withItems }),
    collection: (_, { routeName }) =>
      prisma.collection.findUnique({ where: { routeName }, include: withItems })
  },
  Item: {
    price: item => item.priceInCents / 100
  },
  Mutation: {
    createPaymentIntent: async (_, { items }) => {
      if (!items.length) throw badInput('Cart is empty');

      const ids = items.map(({ id }) => Number(id));
      if (!ids.every(Number.isInteger)) throw badInput('Invalid item id');

      const catalogueItems = await prisma.item.findMany({ where: { id: { in: ids } } });
      const amount = calculateAmountInCents(catalogueItems, items);

      const paymentIntent = await getStripe().paymentIntents.create({
        amount,
        currency: 'usd',
        automatic_payment_methods: { enabled: true }
      });
      return { clientSecret: paymentIntent.client_secret, amount };
    }
  }
};

export const schema = createSchema({ typeDefs, resolvers });
