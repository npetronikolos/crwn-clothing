'use client';

import { useCart } from '@/contexts/cart.context';
import { CartContainer, ShoppingIcon, ItemCountContainer } from './cart-icon.styles';

const CartIcon = () => {
  const { toggleCartHidden, itemCount } = useCart();

  return (
    <CartContainer onClick={toggleCartHidden}>
      <ShoppingIcon />
      <ItemCountContainer>{itemCount}</ItemCountContainer>
    </CartContainer>
  );
};

export default CartIcon;
