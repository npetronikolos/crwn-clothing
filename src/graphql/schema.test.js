import { beforeEach, describe, expect, it, vi } from 'vitest';
import { graphql } from 'graphql';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    section: { findMany: vi.fn() },
    collection: { findMany: vi.fn(), findUnique: vi.fn() },
    item: { findMany: vi.fn() }
  }
}));

vi.mock('../lib/prisma.js', () => ({ prisma: prismaMock }));

const { schema, calculateAmountInCents } = await import('./schema.js');

const hats = {
  id: 1,
  title: 'Hats',
  routeName: 'hats',
  items: [{ id: 1, name: 'Brown Brim', priceInCents: 2500, imageUrl: 'brim.png' }]
};

const execute = (source, variableValues) => graphql({ schema, source, variableValues });

beforeEach(() => vi.clearAllMocks());

describe('collection query', () => {
  it('returns a collection with prices converted to dollars', async () => {
    prismaMock.collection.findUnique.mockResolvedValue(hats);

    const result = await execute(
      'query ($routeName: String!) { collection(routeName: $routeName) { title items { id name price } } }',
      { routeName: 'hats' }
    );

    expect(result.errors).toBeUndefined();
    expect(result.data.collection).toEqual({
      title: 'Hats',
      items: [{ id: '1', name: 'Brown Brim', price: 25 }]
    });
    expect(prismaMock.collection.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { routeName: 'hats' } })
    );
  });

  it('returns null for an unknown collection', async () => {
    prismaMock.collection.findUnique.mockResolvedValue(null);

    const result = await execute('{ collection(routeName: "nope") { title } }');

    expect(result.data.collection).toBeNull();
  });
});

describe('calculateAmountInCents', () => {
  const catalogue = [
    { id: 1, priceInCents: 2500 },
    { id: 2, priceInCents: 1800 }
  ];

  it('totals the cart from catalogue prices', () => {
    expect(
      calculateAmountInCents(catalogue, [
        { id: '1', quantity: 2 },
        { id: '2', quantity: 1 }
      ])
    ).toBe(6800);
  });

  it('rejects unknown items', () => {
    expect(() => calculateAmountInCents(catalogue, [{ id: '99', quantity: 1 }])).toThrow(
      'Unknown item: 99'
    );
  });

  it('rejects invalid quantities', () => {
    expect(() => calculateAmountInCents(catalogue, [{ id: '1', quantity: 0 }])).toThrow(
      'Invalid quantity'
    );
  });
});

describe('createPaymentIntent mutation', () => {
  it('fails clearly when Stripe is not configured', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', '');
    prismaMock.item.findMany.mockResolvedValue([{ id: 1, priceInCents: 2500 }]);

    const result = await execute(
      'mutation { createPaymentIntent(items: [{ id: "1", quantity: 1 }]) { clientSecret } }'
    );

    expect(result.errors[0].message).toBe('Payments are not configured: set STRIPE_SECRET_KEY.');
    vi.unstubAllEnvs();
  });
});
