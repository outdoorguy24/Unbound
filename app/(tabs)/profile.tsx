import { Button } from '@/components/ui/Button';
import { ContentSection } from '@/components/ui/ContentSection';
import { Divider } from '@/components/ui/Divider';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Spacer } from '@/components/ui/Spacer';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useAuth } from '../_layout';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  return (
    <ScreenContainer>
      <ScreenHeader title="Profile" />
      <Spacer size={12} />
      <Text style={{ textAlign: 'center', color: '#6B4F1D', marginBottom: 16 }}>
        Manage your account settings
      </Text>
      <ContentSection title="Settings">
        <Row label="Theme" value="Dark" />
        <Divider />
        <Row label="Weekly Summary" value="Off" />
        <Divider />
        <Row label="Privacy Policy" value="Inactive" />
      </ContentSection>
      <ContentSection title="Account">
        <Button title="Talk with the Founder" onPress={() => router.push('/founder')} />
        <Divider />
        <Row label="Export Data" value="Inactive" />
        <Divider />
        <Row label="Delete Account" value="" />
      </ContentSection>
      <Button title="Log Out" variant="outline" style={{ marginTop: 32, minWidth: 160 }} onPress={() => { logout(); router.replace('/(onboarding)/login'); }} />
    </ScreenContainer>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
      <Text style={{ flex: 1, fontSize: 16 }}>{label}</Text>
      {value ? <Text style={{ color: '#888', fontSize: 16 }}>{value}</Text> : null}
    </View>
  );
} 