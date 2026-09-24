'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CustomButton from '../custom-button/custom-button.component';
import { CREATE_PAYMENT_INTENT } from '@/graphql/operations';
import { PaymentFormContainer, ErrorMessage } from './stripe-button.styles';

const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_WBqax2FWVzS9QlpJScO07iuL';

let stripePromise;
const getStripe = () => (stripePromise ??= loadStripe(publishableKey));

const PaymentForm = ({ price, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async event => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: { return_url: `${window.location.origin}/checkout` }
    });

    setIsProcessing(false);

    if (error) {
      setErrorMessage(error.message);
    } else if (paymentIntent?.status === 'succeeded') {
      alert('Payment Successful!');
      onPaymentSuccess();
    }
  };

  return (
    <PaymentFormContainer onSubmit={handleSubmit}>
      <PaymentElement />
      <CustomButton type='submit' disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing…' : `Pay $${price}`}
      </CustomButton>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </PaymentFormContainer>
  );
};

const StripeCheckoutButton = ({ cartItems, price, onPaymentSuccess }) => {
  const [createPaymentIntent, { loading, error }] = useMutation(CREATE_PAYMENT_INTENT);
  // The intent is created for a specific total; if the cart changes, a new one is needed.
  const [paymentIntent, setPaymentIntent] = useState(null);

  const handlePayNow = async () => {
    try {
      const { data } = await createPaymentIntent({
        variables: { items: cartItems.map(({ id, quantity }) => ({ id, quantity })) }
      });
      setPaymentIntent({ clientSecret: data.createPaymentIntent.clientSecret, price });
    } catch {
      // Shown through the mutation's `error` state below.
    }
  };

  if (paymentIntent && paymentIntent.price === price) {
    return (
      <Elements stripe={getStripe()} options={{ clientSecret: paymentIntent.clientSecret }}>
        <PaymentForm price={price} onPaymentSuccess={onPaymentSuccess} />
      </Elements>
    );
  }

  return (
    <>
      <CustomButton onClick={handlePayNow} disabled={loading || !cartItems.length}>
        {loading ? 'Loading…' : 'Pay Now'}
      </CustomButton>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </>
  );
};

export default StripeCheckoutButton;
