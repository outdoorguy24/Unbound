import { StripeProvider as StripeProviderBase } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';

// Get the publishable key from environment variables
const STRIPE_PUBLISHABLE_KEY = Constants.expoConfig?.extra?.stripePublishableKey;

export function StripeProvider({ children }: { children: React.ReactNode }) {
  return (
    <StripeProviderBase publishableKey={STRIPE_PUBLISHABLE_KEY}>
      {children}
    </StripeProviderBase>
  );
} 