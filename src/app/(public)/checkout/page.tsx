'use client';

import React, {useMemo} from 'react';
import {CheckoutForm, CheckoutFormProvider, useCheckoutForm} from '@stripe/react-stripe-js/checkout';
import type {StripeCheckoutFormConfirmEvent} from '@stripe/stripe-js';
import {stripePromise} from '@/lib/stripe';

const CheckoutFormTeste = () => {
  const checkoutState = useCheckoutForm();

  if (checkoutState.type === 'error') {
    return <div>Error: {checkoutState.error.message}</div>;
  }

  const onConfirm = async (event: StripeCheckoutFormConfirmEvent) => {
    if (checkoutState.type === 'success') {
      try {
        await checkoutState.checkout.confirm({formConfirmEvent: event});
      } catch (error) {
        console.error('Payment confirmation error:', error);
      }
    }
  };

  return <CheckoutForm onConfirm={onConfirm} className='w-lg' />;
};

export default function CheckoutPage() {
  const clientSecret = useMemo(() => (
    fetch('http://localhost:1323/api/v1/checkout/session', {method: 'POST'})
      .then((response) => response.json())
      .then((json) => {console.log(json); return json.data;})
  ), []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <CheckoutFormProvider
          stripe={stripePromise}
          options={{clientSecret}}
        >
          <CheckoutFormTeste />
        </CheckoutFormProvider>
    </div>
  );
};