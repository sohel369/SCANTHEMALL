import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { stripeAPI } from "../../api/stripe";
import { accountAPI } from "../../api/api";
import PaymentMethodsSection from "./PaymentMethodsSection";
import PaymentHistorySection from "./PaymentHistorySection";
import AddPaymentMethodModal from "./AddPaymentMethodModal";

export default function BillingPageNew() {
  const [stripePromise, setStripePromise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('payment-methods');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [customerCreated, setCustomerCreated] = useState(false);

  useEffect(() => {
    initializeStripe();
  }, []);

  useEffect(() => {
    if (stripePromise && !customerCreated) {
      ensureStripeCustomer();
    }
  }, [stripePromise]);

  useEffect(() => {
    if (customerCreated) {
      loadData();
    }
  }, [customerCreated, refreshTrigger]);

  const initializeStripe = async () => {
    try {
      setLoading(true);
      const { publishableKey } = await stripeAPI.getConfig();
      
      if (!publishableKey) {
        throw new Error('Stripe publishable key not configured');
      }

      const stripe = await loadStripe(publishableKey);
      setStripePromise(stripe);
    } catch (err) {
      console.error('Error initializing Stripe:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const ensureStripeCustomer = async () => {
    try {
      // Get user account info
      const account = await accountAPI.getAccount();
      
      // Create Stripe customer if not exists
      const result = await stripeAPI.createCustomer(
        account.email,
        `${account.first_name || ''} ${account.last_name || ''}`.trim() || account.email,
        account.company || ''
      );
      
      console.log('Stripe customer:', result);
      setCustomerCreated(true);
      setLoading(false);
    } catch (err) {
      console.error('Error creating Stripe customer:', err);
      // If customer already exists, that's fine
      if (err.message.includes('already exists')) {
        setCustomerCreated(true);
        setLoading(false);
      } else {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  const loadData = async () => {
    try {
      const [methods, history] = await Promise.all([
        stripeAPI.getPaymentMethods(),
        stripeAPI.getPaymentHistory(),
      ]);

      setPaymentMethods(methods.paymentMethods || []);
      setPaymentHistory(history || []);
    } catch (err) {
      console.error('Error loading billing data:', err);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRemovePaymentMethod = async (paymentMethodId) => {
    if (!confirm('Are you sure you want to remove this payment method?')) {
      return;
    }

    try {
      await stripeAPI.detachPaymentMethod(paymentMethodId);
      handleRefresh();
    } catch (err) {
      alert('Failed to remove payment method: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-neutral-300">Setting up your billing account...</p>
          <p className="text-sm text-neutral-500 mt-2">This will only take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold">Error Loading Billing</p>
            <p className="text-sm text-neutral-400 mt-2">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              initializeStripe();
            }}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-neutral-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Billing & Payments</h2>
          <p className="text-sm text-neutral-400 mt-1">Manage your payment methods and view transaction history</p>
        </div>
        <button
          onClick={() => setShowAddPaymentModal(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Payment Method
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
        <button
          onClick={() => setActiveTab('payment-methods')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors font-medium ${
            activeTab === 'payment-methods'
              ? 'bg-sky-600 text-white'
              : 'text-neutral-300 hover:bg-slate-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Payment Methods
          </div>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors font-medium ${
            activeTab === 'history'
              ? 'bg-sky-600 text-white'
              : 'text-neutral-300 hover:bg-slate-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Payment History
          </div>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'payment-methods' && (
        <PaymentMethodsSection
          paymentMethods={paymentMethods}
          onRemove={handleRemovePaymentMethod}
          onRefresh={handleRefresh}
        />
      )}

      {activeTab === 'history' && (
        <PaymentHistorySection
          paymentHistory={paymentHistory}
          onRefresh={handleRefresh}
        />
      )}

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && stripePromise && (
        <Elements stripe={stripePromise}>
          <AddPaymentMethodModal
            onClose={() => setShowAddPaymentModal(false)}
            onSuccess={() => {
              setShowAddPaymentModal(false);
              handleRefresh();
            }}
          />
        </Elements>
      )}
    </div>
  );
}
