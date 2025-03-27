import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51R6eNuGbqKkheqcfaBS51QKaDJrtC5a3JhTs4KIhz5QgwMy3AhPfegcoJBtflikGjLkeVYAJiHDG9FUP87Tk9NrD00FapVeZFv', {
  apiVersion: '2023-10-16'
});

export async function createPayment(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency, description, metadata } = body;

    // Validate required fields
    if (!amount || !currency || !description) {
      throw new Error('Missing required payment fields');
    }

    console.log('Creating payment with data:', {
      amount,
      currency,
      description,
      metadata
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      description,
      metadata: {
        order_number: metadata?.orderNumber || '',
        customer_name: metadata?.customerName || 'Guest',
        email: metadata?.email || ''
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always'
      }
    });

    console.log('Payment intent created:', paymentIntent);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  } catch (error) {
    console.error('Payment creation error:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Payment creation failed'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  }
}