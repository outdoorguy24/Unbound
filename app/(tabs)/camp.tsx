import { ContentSection } from '@/components/ui/ContentSection';
import { Divider } from '@/components/ui/Divider';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Spacer } from '@/components/ui/Spacer';
import { Text } from 'react-native';

export default function CampScreen() {
  return (
    <ScreenContainer>
      <ScreenHeader title="Camp" />
      <Spacer size={12} />
      <ContentSection>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
          YOU WERE BORN TO DO MORE THAN SCROLL
        </Text>
        <Spacer size={8} />
        <Text style={{ textAlign: 'center', color: '#6B4F1D' }}>
          UNBOUND YOURSELF
        </Text>
      </ContentSection>
      <Divider />
      <ContentSection title="Your Stats">
        <Text>Average hours on phone per day: <Text style={{ fontWeight: 'bold' }}>5.4</Text></Text>
        <Text>Days wasted per year: <Text style={{ fontWeight: 'bold' }}>82</Text></Text>
        <Text>Years of your life lost: <Text style={{ fontWeight: 'bold' }}>13</Text></Text>
      </ContentSection>
      <Divider />
      <ContentSection>
        <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>
          "It's time to put the phone down and pick that hobby back up."
        </Text>
      </ContentSection>
    </ScreenContainer>
  );
} 