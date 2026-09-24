import { describe, expect, it } from 'vitest';
import { addItemToCart, removeItemFromCart } from './cart.utils';

const hat = { id: '1', name: 'Brown Brim', price: 25 };
const beanie = { id: '2', name: 'Blue Beanie', price: 18 };

describe('addItemToCart', () => {
  it('adds a new item with quantity 1', () => {
    expect(addItemToCart([], hat)).toEqual([{ ...hat, quantity: 1 }]);
  });

  it('increments the quantity of an item already in the cart', () => {
    const cart = [{ ...hat, quantity: 1 }, { ...beanie, quantity: 1 }];
    expect(addItemToCart(cart, hat)).toEqual([
      { ...hat, quantity: 2 },
      { ...beanie, quantity: 1 }
    ]);
  });
});

describe('removeItemFromCart', () => {
  it('decrements the quantity', () => {
    expect(removeItemFromCart([{ ...hat, quantity: 2 }], hat)).toEqual([{ ...hat, quantity: 1 }]);
  });

  it('removes the item when the last one is taken out', () => {
    expect(removeItemFromCart([{ ...hat, quantity: 1 }], hat)).toEqual([]);
  });

  it('ignores items that are not in the cart', () => {
    const cart = [{ ...hat, quantity: 1 }];
    expect(removeItemFromCart(cart, beanie)).toBe(cart);
  });
});
