export default function PaymentMethodsSection({ paymentMethods, onRemove, onRefresh }) {
  const getCardBrandIcon = (brand) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
      diners: '💳',
      jcb: '💳',
      unionpay: '💳',
    };
    return icons[brand?.toLowerCase()] || '💳';
  };

  const getCardBrandColor = (brand) => {
    const colors = {
      visa: 'from-blue-600 to-blue-800',
      mastercard: 'from-red-600 to-orange-600',
      amex: 'from-blue-700 to-blue-900',
      discover: 'from-orange-600 to-orange-800',
    };
    return colors[brand?.toLowerCase()] || 'from-slate-700 to-slate-900';
  };

  if (paymentMethods.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-200 mb-2">No Payment Methods</h3>
          <p className="text-neutral-400 text-sm mb-6">
            Add a payment method to start booking ad placements and managing your campaigns.
          </p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-neutral-300 rounded-lg transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Total Cards</p>
              <p className="text-2xl font-bold text-neutral-100">{paymentMethods.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Active</p>
              <p className="text-2xl font-bold text-neutral-100">{paymentMethods.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Secure</p>
              <p className="text-2xl font-bold text-neutral-100">100%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="relative bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-sky-600 transition-colors group"
          >
            {/* Card Design */}
            <div className={`bg-gradient-to-br ${getCardBrandColor(method.card?.brand)} p-6 relative`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
              </div>

              {/* Card Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-2xl">{getCardBrandIcon(method.card?.brand)}</div>
                  <div className="text-white text-sm font-medium uppercase">
                    {method.card?.brand || 'Card'}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-white text-xl font-mono tracking-wider">
                    •••• •••• •••• {method.card?.last4}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white text-opacity-70 text-xs mb-1">Expires</div>
                    <div className="text-white font-medium">
                      {String(method.card?.exp_month).padStart(2, '0')}/{method.card?.exp_year}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-opacity-70 text-xs mb-1">Type</div>
                    <div className="text-white font-medium capitalize">
                      {method.card?.funding || 'Credit'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-900 text-green-200 text-xs rounded-full">
                  Active
                </span>
                {method.card?.checks?.cvc_check === 'pass' && (
                  <span className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded-full">
                    Verified
                  </span>
                )}
              </div>
              <button
                onClick={() => onRemove(method.id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Notice */}
      <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-blue-200 mb-1">Secure Payment Processing</h4>
            <p className="text-xs text-blue-300">
              All payment information is encrypted and securely processed by Stripe. We never store your full card details on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
