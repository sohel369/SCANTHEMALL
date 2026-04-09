import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  createStripeCustomer,
  createPaymentIntent,
  getPaymentMethods,
  attachPaymentMethod,
  detachPaymentMethod,
  getPaymentHistory,
  handleStripeWebhook,
  createSetupIntent,
  getPublishableKey,
} from '../controllers/stripe.controller.js';

const router = express.Router();

// Public route for publishable key
router.get('/config', getPublishableKey);

// Webhook route (no auth, verified by Stripe signature)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Protected routes (advertiser only)
router.use(auth(['advertiser', 'ancillary_advertiser', 'admin']));

router.post('/customer', createStripeCustomer);
router.post('/payment-intent', createPaymentIntent);
router.post('/setup-intent', createSetupIntent);
router.get('/payment-methods', getPaymentMethods);
router.post('/payment-methods/attach', attachPaymentMethod);
router.delete('/payment-methods/:paymentMethodId', detachPaymentMethod);
router.get('/payment-history', getPaymentHistory);

export default router;
