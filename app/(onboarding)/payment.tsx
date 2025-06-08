import { Button } from '@/components/ui/Button';
import { createSubscription, PRICES } from '@/lib/paymentService';
import { useStripe } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

export default function PaymentScreen() {
  const router = useRouter();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(true);

      // Create the subscription
      const { subscriptionId, clientSecret } = await createSubscription(priceId);

      // Initialize the payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Unbound',
        customerId: subscriptionId,
        customerEphemeralKeySecret: clientSecret,
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
      });

      if (initError) {
        Alert.alert('Error', initError.message);
        return;
      }

      // Present the payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Alert.alert('Error', presentError.message);
      } else {
        // Payment successful
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Plan</Text>
      <Text style={styles.body}>Select a subscription plan to continue.</Text>
      
      <Button 
        title={loading ? 'Processing...' : 'Monthly Plan - $2/mo'} 
        onPress={() => handleSubscribe(PRICES.monthly)}
        disabled={loading}
      />
      
      <Button 
        title={loading ? 'Processing...' : 'Yearly Plan - $20/year'} 
        onPress={() => handleSubscribe(PRICES.yearly)}
        disabled={loading}
        style={styles.yearlyButton}
      />

      {loading && <ActivityIndicator style={styles.loader} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  body: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
  },
  yearlyButton: {
    marginTop: 16,
  },
  loader: {
    marginTop: 20,
  },
}); 