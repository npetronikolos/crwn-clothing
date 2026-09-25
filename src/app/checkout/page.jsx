'use client';

import CheckoutItem from '@/components/checkout-item/checkout-item.component';
import StripeCheckoutButton from '@/components/stripe-button/stripe-button.component';
import { useCart } from '@/contexts/cart.context';
import {
  CheckoutPageContainer,
  CheckoutHeaderContainer,
  HeaderBlockContainer,
  TotalContainer,
  WarningContainer
} from './checkout.styles';

const CheckoutPage = () => {
  const { cartItems, total, clearCart } = useCart();

  return (
    <CheckoutPageContainer>
      <CheckoutHeaderContainer>
        <HeaderBlockContainer>
          <span>Product</span>
        </HeaderBlockContainer>
        <HeaderBlockContainer>
          <span>Description</span>
        </HeaderBlockContainer>
        <HeaderBlockContainer>
          <span>Quantity</span>
        </HeaderBlockContainer>
        <HeaderBlockContainer>
          <span>Price</span>
        </HeaderBlockContainer>
        <HeaderBlockContainer>
          <span>Remove</span>
        </HeaderBlockContainer>
      </CheckoutHeaderContainer>
      {cartItems.map(cartItem => (
        <CheckoutItem key={cartItem.id} cartItem={cartItem} />
      ))}
      <TotalContainer>TOTAL: ${total}</TotalContainer>
      <WarningContainer>
        *Please use the following test card for payments*
        <br />
        4242 4242 4242 4242 - Exp: any future date - CVC: 123
      </WarningContainer>
      <StripeCheckoutButton cartItems={cartItems} price={total} onPaymentSuccess={clearCart} />
    </CheckoutPageContainer>
  );
};

export default CheckoutPage;
