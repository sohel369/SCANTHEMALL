import Stripe from 'stripe';
import { pool } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe customer for advertiser
export const createStripeCustomer = async (req, res) => {
  const advertiserId = req.user.id;
  const { email, name, company } = req.body;

  try {
    // Check if customer already exists
    const { rows } = await pool.query(
      'SELECT stripe_customer_id FROM user_profiles WHERE user_id = $1',
      [advertiserId]
    );

    if (rows[0]?.stripe_customer_id) {
      // Verify customer still exists in Stripe
      try {
        const customer = await stripe.customers.retrieve(rows[0].stripe_customer_id);
        if (!customer.deleted) {
          return res.json({ 
            customerId: rows[0].stripe_customer_id,
            message: 'Customer already exists'
          });
        }
      } catch (err) {
        // Customer doesn't exist in Stripe, create new one
        console.log('Stripe customer not found, creating new one');
      }
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: email,
      name: name,
      metadata: {
        user_id: advertiserId.toString(),
        company: company || ''
      }
    });

    // Save customer ID to database
    await pool.query(
      `INSERT INTO user_profiles (user_id, company, stripe_customer_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET
         stripe_customer_id = EXCLUDED.stripe_customer_id,
         company = COALESCE(EXCLUDED.company, user_profiles.company),
         updated_at = NOW()`,
      [advertiserId, company, customer.id]
    );

    res.json({ 
      customerId: customer.id,
      message: 'Customer created successfully'
    });
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    res.status(500).json({ error: error.message });
  }
};

// Create payment intent for booking
export const createPaymentIntent = async (req, res) => {
  const advertiserId = req.user.id;
  const { amount, currency = 'usd', bookingId, description } = req.body;

  try {
    // Get customer ID
    const { rows } = await pool.query(
      'SELECT stripe_customer_id FROM user_profiles WHERE user_id = $1',
      [advertiserId]
    );

    const customerId = rows[0]?.stripe_customer_id;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      customer: customerId,
      description: description || `Booking #${bookingId}`,
      metadata: {
        user_id: advertiserId.toString(),
        booking_id: bookingId?.toString() || ''
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Save payment intent to database
    await pool.query(
      `INSERT INTO payments (
        advertiser_id, 
        stripe_payment_intent_id, 
        amount, 
        currency, 
        status, 
        booking_id,
        description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        advertiserId,
        paymentIntent.id,
        amount,
        currency,
        paymentIntent.status,
        bookingId,
        description
      ]
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get payment methods for customer
export const getPaymentMethods = async (req, res) => {
  const advertiserId = req.user.id;

  try {
    // Get customer ID
    const { rows } = await pool.query(
      'SELECT stripe_customer_id FROM user_profiles WHERE user_id = $1',
      [advertiserId]
    );

    const customerId = rows[0]?.stripe_customer_id;

    if (!customerId) {
      return res.json({ paymentMethods: [] });
    }

    // Get payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    res.json({ paymentMethods: paymentMethods.data });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: error.message });
  }
};

// Attach payment method to customer
export const attachPaymentMethod = async (req, res) => {
  const advertiserId = req.user.id;
  const { paymentMethodId } = req.body;

  try {
    // Get customer ID
    const { rows } = await pool.query(
      'SELECT stripe_customer_id FROM user_profiles WHERE user_id = $1',
      [advertiserId]
    );

    const customerId = rows[0]?.stripe_customer_id;

    if (!customerId) {
      return res.status(400).json({ error: 'No Stripe customer found' });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    res.json({ message: 'Payment method attached successfully' });
  } catch (error) {
    console.error('Error attaching payment method:', error);
    res.status(500).json({ error: error.message });
  }
};

// Detach payment method
export const detachPaymentMethod = async (req, res) => {
  const { paymentMethodId } = req.params;

  try {
    await stripe.paymentMethods.detach(paymentMethodId);
    res.json({ message: 'Payment method removed successfully' });
  } catch (error) {
    console.error('Error detaching payment method:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
  const advertiserId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT 
        p.*,
        b.campaign_name,
        b.placement_id
       FROM payments p
       LEFT JOIN bookings b ON b.id = p.booking_id
       WHERE p.advertiser_id = $1
       ORDER BY p.created_at DESC`,
      [advertiserId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: error.message });
  }
};

// Webhook handler for Stripe events
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      // Update payment status in database
      await pool.query(
        'UPDATE payments SET status = $1, paid_at = NOW() WHERE stripe_payment_intent_id = $2',
        ['succeeded', paymentIntent.id]
      );

      // Update booking status if applicable
      const { rows } = await pool.query(
        'SELECT booking_id FROM payments WHERE stripe_payment_intent_id = $1',
        [paymentIntent.id]
      );

      if (rows[0]?.booking_id) {
        await pool.query(
          'UPDATE bookings SET status = $1 WHERE id = $2',
          ['approved', rows[0].booking_id]
        );
      }

      console.log('Payment succeeded:', paymentIntent.id);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      
      await pool.query(
        'UPDATE payments SET status = $1 WHERE stripe_payment_intent_id = $2',
        ['failed', failedPayment.id]
      );

      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Create setup intent for saving payment method
export const createSetupIntent = async (req, res) => {
  const advertiserId = req.user.id;

  try {
    // Get customer ID
    const { rows } = await pool.query(
      'SELECT stripe_customer_id FROM user_profiles WHERE user_id = $1',
      [advertiserId]
    );

    const customerId = rows[0]?.stripe_customer_id;

    if (!customerId) {
      return res.status(400).json({ error: 'No Stripe customer found. Please create customer first.' });
    }

    // Create setup intent
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });

    res.json({
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id
    });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Stripe publishable key
export const getPublishableKey = async (req, res) => {
  res.json({ 
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY 
  });
};
