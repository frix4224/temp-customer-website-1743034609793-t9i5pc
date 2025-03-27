import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51R6eNuGbqKkheqcfaBS51QKaDJrtC5a3JhTs4KIhz5QgwMy3AhPfegcoJBtflikGjLkeVYAJiHDG9FUP87Tk9NrD00FapVeZFv', {
  apiVersion: '2023-10-16'
});

export async function checkPayment(req: Request) {
  try {
    const url = new URL(req.url);
    const paymentIntentId = url.searchParams.get('payment_intent');

    if (!paymentIntentId) {
      throw new Error('Payment intent ID is required');
    }

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Get order details from metadata
    const orderNumber = paymentIntent.metadata.order_number;
    const totalAmount = paymentIntent.amount / 100; // Convert from cents to euros

    return new Response(
      JSON.stringify({
        status: paymentIntent.status,
        orderDetails: {
          orderNumber,
          totalAmount,
          estimatedDelivery: new Date().toISOString() // You would get this from your database
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  } catch (error) {
    console.error('Payment check error:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Payment check failed'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  }
}