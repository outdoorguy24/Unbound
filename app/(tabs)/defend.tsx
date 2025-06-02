import { Button } from '@/components/ui/Button';
import { ContentSection } from '@/components/ui/ContentSection';
import { Divider } from '@/components/ui/Divider';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Spacer } from '@/components/ui/Spacer';
import { useRouter } from 'expo-router';
import { Switch, Text, View } from 'react-native';

const blockApps = [
  { name: 'Instagram', url: 'instagram.com' },
  { name: 'Facebook', url: 'facebook.com' },
  { name: 'YouTube', url: 'youtube.com' },
  { name: 'Reddit', url: 'reddit.com' },
];

export default function DefendScreen() {
  const router = useRouter();
  return (
    <ScreenContainer>
      <ScreenHeader title="Defend" />
      <Spacer size={12} />
      <ContentSection>
        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
          It's time to put the phone down and pick that hobby back up
        </Text>
        <Spacer size={8} />
        <Text style={{ textAlign: 'center', color: '#6B4F1D' }}>
          Toggle to block or unblock
        </Text>
      </ContentSection>
      <Divider />
      <ContentSection title="Block Apps & Sites">
        {blockApps.map((app) => (
          <View key={app.name} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#eee', borderRadius: 8, padding: 12 }}>
            <Text style={{ flex: 1, fontWeight: '600' }}>{app.name}</Text>
            <Text style={{ marginRight: 12, color: '#888' }}>{app.url}</Text>
            <Switch value={true} />
          </View>
        ))}
      </ContentSection>
      <Divider />
      <ContentSection>
        <Button title="Defend Your Time" onPress={() => router.push('/defend-modal')} />
      </ContentSection>
    </ScreenContainer>
  );
} 