// Stripe Payments API Endpoint
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { planId, paymentMethod, amount, currency = 'eur' } = req.body;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: ['card'],
      metadata: {
        planId,
        userId: req.user?.id || 'guest'
      }
    });

    // Store payment record in database
    // This would integrate with your Supabase database
    
    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    });
  } catch (error) {
    console.error('Stripe payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}