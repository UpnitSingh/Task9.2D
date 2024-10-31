// PricingPlan.js
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'; // You need to create this component

const stripePromise = loadStripe('your-public-key-here'); // Replace with your actual Stripe public key

function PricingPlan() {
  return (
    <div>
      <h2>Choose Your Plan</h2>
      <div>
        <h3>Free Plan</h3>
        <p>Basic features with limited access.</p>
      </div>
      <div>
        <h3>Premium Plan</h3>
        <p>Get full access with advanced features.</p>
        <Elements stripe={stripePromise}>
          <CheckoutForm /> {/* This handles the payment process */}
        </Elements>
      </div>
    </div>
  );
}

export default PricingPlan;
