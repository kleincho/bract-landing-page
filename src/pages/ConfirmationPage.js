import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_URL } from '../services/config';

// Initialize Stripe (move this outside the component)
const stripePromise = loadStripe('pk_live_51QdrunAYYPWY7sydmp1XEy80jBrIjT9QFZZJxHd3K1qiycO2DpLTxi4sU4ddZcREAFP31T1L5r0tuTgXrqMipJWX008YFtL0xy');

// Payment Form Component
const PaymentForm = ({ email }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    if (!stripe || !elements) {
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: { email }
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      // Validate card
      const response = await fetch(`${API_URL}/api/validate-card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          payment_method_id: paymentMethod.id
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail);
      }

      /*
      // Update waitlist entry to mark as having valid card
      const waitlistResponse = await fetch(`${API_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          has_valid_card: true,
          created_at: new Date().toISOString()
        })
      });
      

      if (!waitlistResponse.ok) {
        throw new Error('Failed to update waitlist status');
      }
      */

      setSucceeded(true);
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        ':focus': {
          color: '#4AA3DF',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Information
        </label>
        <div className="border rounded-lg p-4 bg-white">
          <CardElement options={cardStyle} />
        </div>
      </div>

      {errorMessage && (
        <div className="text-red-600 text-sm">
          {errorMessage}
        </div>
      )}

      {succeeded ? (
        <div className="bg-green-50 text-green-700 rounded-lg p-4 text-center">
          <div className="font-medium">You're all set!</div>
          <div className="text-sm">We'll notify you when we launch in June 2025</div>
        </div>
      ) : (
        <>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full bg-[#4AA3DF] text-white rounded-lg px-4 py-3 font-medium hover:bg-[#3182a8] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Secure Your Discount Before Launch →'
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            No charge now. Your card will only be charged when we launch in March 2024.
            <br />
            Cancel anytime before launch at no cost.
          </p>
        </>
      )}
    </form>
  );
};

function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Redirect if no email (if someone tries to access directly)
  useEffect(() => {
    if (!email) {
      navigate('/');
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-white border-b">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <img 
            src="/humint_logo.png" 
            alt="HUMINT"
            className="h-8 w-auto"
          />
          <div className="text-sm text-gray-500">
            Questions? Email support@humint.ai
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Success Message */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to humint!
            </h1>
            <p className="text-gray-600 mb-2">
              You're officially on our waitlist. We're launching in just one month!
            </p>
            <div className="inline-block bg-[#4AA3DF]/10 text-[#4AA3DF] text-sm px-3 py-1 rounded-full">
              Expected Launch: June 2025
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600">Confirmation sent to:</div>
            <div className="font-medium text-gray-900">{email}</div>
          </div>
        </div>

        {/* Launch Offer */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#4AA3DF]/10 p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full mb-4">
              Pre-Launch Offer • Expires in 30 Days
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Lock in 50% Off Forever
            </h2>
            <p className="text-gray-600">
              Join our founding members before launch and get lifetime access at half price
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">What you get:</h3>
              <ul className="space-y-3">
                {[
                  '50% off forever on all plans',
                  'Priority access when we launch',
                  'Dedicated support channel',
                  'Early access to new features',
                  'Founding member badge'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-[#4AA3DF]/10">
              <div className="text-center mb-6">
                <div className="text-gray-900 font-medium mb-1">Regular Price</div>
                <div className="text-gray-500 line-through text-2xl">$30/month</div>
                <div className="text-gray-900 font-medium mt-4 mb-1">Your Price</div>
                <div className="text-3xl font-bold text-[#4AA3DF]">$15/month</div>
                <div className="text-sm text-gray-500 mt-1">Lock in this price forever</div>
              </div>

              <Elements stripe={stripePromise}>
                <PaymentForm email={email} />
              </Elements>
            </div>
          </div>

          {/* Social Proof */}
          <div className="border-t pt-8">
            <h3 className="text-center font-medium text-gray-900 mb-6">
              What Beta Users Are Saying
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "This is exactly what I needed for my IB recruiting.",
                  author: "Finance Student, NYU"
                },
                {
                  quote: "The personalized insights are game-changing.",
                  author: "Analyst, Goldman Sachs"
                },
                {
                  quote: "Worth every penny for the quality of information.",
                  author: "Associate, Morgan Stanley"
                }
              ].map((testimonial, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 italic mb-2">"{testimonial.quote}"</p>
                  <p className="text-xs text-gray-500">{testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 text-sm hover:text-[#4AA3DF] transition-colors"
          >
            I'll wait for the full price launch in March →
          </button>
        </div>
      </main>
    </div>
  );
}

export default ConfirmationPage;
