import { supabase } from './supabaseClient';

const SUBSCRIPTION_PRICES = {
  monthly: 'price_monthly_id', // Replace with your Stripe price ID
  yearly: 'price_yearly_id',   // Replace with your Stripe price ID
};

export async function createSubscription(priceId: string) {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Create or get Stripe customer
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (customerError && customerError.code !== 'PGRST116') {
      throw customerError;
    }

    let stripeCustomerId = customer?.stripe_customer_id;

    if (!stripeCustomerId) {
      // Create a new customer in Stripe
      const { data: newCustomer, error: createError } = await supabase.functions.invoke('create-stripe-customer', {
        body: { email: user.email },
      });

      if (createError) throw createError;
      stripeCustomerId = newCustomer.id;

      // Save the customer ID to the database
      await supabase.from('customers').insert({
        user_id: user.id,
        stripe_customer_id: stripeCustomerId,
      });
    }

    // Create the subscription
    const { data: subscription, error: subscriptionError } = await supabase.functions.invoke('create-stripe-subscription', {
      body: {
        priceId,
        customerId: stripeCustomerId,
      },
    });

    if (subscriptionError) throw subscriptionError;

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

export const PRICES = SUBSCRIPTION_PRICES; 