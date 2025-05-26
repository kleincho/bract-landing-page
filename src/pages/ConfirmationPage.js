import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_URL } from '../services/config';
import { isMobile } from 'react-device-detect';

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
          <div className="text-sm">We'll notify you soon</div>
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
              <>
                Secure Your Discount →
                <br />
                <i>No Charge Today</i>
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            No charge now. Your card will only be charged with consent when we launch in June 2025.
            <br />
            Cancel anytime before launch at no cost.
          </p>
        </>
      )}
    </form>
  );
};

// Mobile version of the confirmation page
const MobileConfirmationPage = ({ email }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation - With clickable left-aligned logo */}
      <nav className="px-4 py-3 bg-white border-b">
        <div className="flex justify-start items-center">
          <img 
            src="/bract-logo-upscaled.png" 
            alt="Bract"
            className="h-8 w-auto cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>
      </nav>

      <main className="px-4 py-8">
        {/* Success Message */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Welcome to Bract!
            </h1>
            <p className="text-sm text-gray-600 mb-2">
              You're officially on our waitlist. We're launching in just one month!
            </p>
            <div className="inline-block bg-[#4AA3DF]/10 text-[#4AA3DF] text-xs px-3 py-1 rounded-full">
              Expected Launch: July 2025
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="text-xs text-gray-600">Confirmed Email:</div>
            <div className="text-sm font-medium text-gray-900">{email}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Update the main ConfirmationPage component to use mobile version when appropriate
function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/');
    }
  }, [email, navigate]);

  if (!email) return null;

  return (
    <>
      {isMobile ? (
        <MobileConfirmationPage email={email} />
      ) : (
        <div className="min-h-screen bg-gray-50">
          {/* Navigation */}
          <nav className="px-6 py-4 bg-white border-b">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
              <img 
                src="/bract-logo-upscaled.png" 
                alt="Bract"
                className="h-8 w-auto cursor-pointer"
                onClick={() => navigate('/')}
              />
              <div className="text-sm text-gray-500">
                Questions? Email sungcho9@wharton.upenn.edu
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
                  Welcome to Bract!
                </h1>
                <p className="text-gray-600 mb-2">
                  You're officially on our waitlist. We're launching in just one month!
                </p>
                <div className="inline-block bg-[#4AA3DF]/10 text-[#4AA3DF] text-sm px-3 py-1 rounded-full">
                  Expected Launch: July 2025
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600">Confirmed Email:</div>
                <div className="font-medium text-gray-900">{email}</div>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}

export default ConfirmationPage;
