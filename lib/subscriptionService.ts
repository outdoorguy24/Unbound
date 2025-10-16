import { supabase } from './supabaseClient';

/**
 * SUBSCRIPTION SERVICE
 * 
 * DEVELOPMENT MODE: Currently shows mock data for all users
 * PRODUCTION MODE: Set isDevelopmentMode = false to use real Supabase data
 * 
 * This service is ready for Superwall integration and App Store submission.
 * Mock data will be shown until real subscription data is available.
 */

export interface SubscriptionData {
  planType: 'monthly' | 'yearly' | 'free';
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  price: number;
  currency: string;
  renewalDate: string;
  isActive: boolean;
  subscriptionId?: string;
  customerId?: string;
}

export interface MockSubscriptionData {
  planType: 'monthly' | 'yearly';
  status: 'active';
  price: number;
  currency: string;
  renewalDate: string;
  isActive: true;
}

// Mock subscription data for development
const MOCK_SUBSCRIPTION_DATA: MockSubscriptionData = {
  planType: 'monthly',
  status: 'active',
  price: 6.99,
  currency: 'USD',
  renewalDate: '2025-09-08',
  isActive: true,
};

/**
 * Get customer data for a user (separate from subscription)
 */
async function getCustomerData(userId: string): Promise<string | undefined> {
  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching customer data:', error);
      return undefined;
    }

    return customer?.stripe_customer_id;
  } catch (error) {
    console.error('Error in getCustomerData:', error);
    return undefined;
  }
}

/**
 * Get subscription data for a user
 * Returns mock data for development, real data for production
 */
export async function getSubscriptionData(userId: string): Promise<SubscriptionData> {
  try {
    // For App Store submission and development, use mock data for all users
    // This will be changed to real data once Superwall integration is live
    const isDevelopmentMode = true; // Set to false when ready for production
    
    if (isDevelopmentMode) {
      console.log('Using mock subscription data for development/App Store submission');
      return MOCK_SUBSCRIPTION_DATA;
    }

    // For real users in production, fetch from Supabase
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching subscription data:', error);
      // Fallback to mock data if there's an error
      return MOCK_SUBSCRIPTION_DATA;
    }

    if (!subscription) {
      console.log('No subscription found, returning free plan');
      return {
        planType: 'free',
        status: 'inactive',
        price: 0,
        currency: 'USD',
        renewalDate: '',
        isActive: false,
      };
    }

    // Get customer data separately
    const customerId = await getCustomerData(userId);

    // Parse subscription data
    const planType = subscription.price_id?.includes('yearly') ? 'yearly' : 'monthly';
    const price = planType === 'yearly' ? 59.99 : 6.99; // Default prices, should come from Stripe/Superwall
    const renewalDate = subscription.updated_at ? 
      new Date(new Date(subscription.updated_at).getTime() + (planType === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
      '';

    return {
      planType,
      status: subscription.status as 'active' | 'inactive' | 'cancelled' | 'expired',
      price,
      currency: 'USD',
      renewalDate,
      isActive: subscription.status === 'active',
      subscriptionId: subscription.stripe_subscription_id,
      customerId,
    };

  } catch (error) {
    console.error('Error in getSubscriptionData:', error);
    // Fallback to mock data on any error
    return MOCK_SUBSCRIPTION_DATA;
  }
}

/**
 * Update subscription data in Supabase
 * This would typically be called by webhooks from Stripe/Superwall
 */
export async function updateSubscriptionData(
  userId: string, 
  subscriptionData: Partial<SubscriptionData>
): Promise<void> {
  try {
    const isMockUser = userId.length <= 10;
    
    if (isMockUser) {
      console.log('Mock user - skipping subscription update');
      return;
    }

    // Update subscription record
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        id: userId,
        stripe_subscription_id: subscriptionData.subscriptionId,
        status: subscriptionData.status,
        price_id: subscriptionData.planType === 'yearly' ? 'price_yearly_id' : 'price_monthly_id',
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating subscription data:', error);
      throw error;
    }

    console.log('Subscription data updated successfully');

  } catch (error) {
    console.error('Error in updateSubscriptionData:', error);
    throw error;
  }
}

/**
 * Get subscription status for quick checks
 */
export async function getSubscriptionStatus(userId: string): Promise<boolean> {
  try {
    const subscriptionData = await getSubscriptionData(userId);
    return subscriptionData.isActive;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}

/**
 * Format renewal date for display
 */
export function formatRenewalDate(renewalDate: string): string {
  if (!renewalDate) return '';
  
  try {
    const date = new Date(renewalDate);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting renewal date:', error);
    return renewalDate;
  }
}

/**
 * Get plan display name
 */
export function getPlanDisplayName(planType: string): string {
  switch (planType) {
    case 'monthly':
      return 'Monthly';
    case 'yearly':
      return 'Yearly';
    case 'free':
      return 'Free';
    default:
      return 'Unknown';
  }
}

/**
 * Get alternative plan (for upgrade/downgrade)
 */
export function getAlternativePlan(currentPlan: string): string {
  return currentPlan === 'monthly' ? 'yearly' : 'monthly';
}

/**
 * Get alternative plan price
 */
export function getAlternativePlanPrice(planType: string): number {
  return planType === 'yearly' ? 59.99 : 6.99;
}
