import { ContentSection } from '@/components/ui/ContentSection';
import { Divider } from '@/components/ui/Divider';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Spacer } from '@/components/ui/Spacer';
import { Text, View } from 'react-native';

export default function TrailLogScreen() {
  return (
    <ScreenContainer>
      <ScreenHeader title="Trail Log" />
      <Spacer size={12} />
      <ContentSection>
        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
          Total time reclaimed since installation
        </Text>
      </ContentSection>
      <Divider />
      <ContentSection>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <View style={boxStyle}><Text style={boxTitle}>0m</Text><Text>TIME SAVED</Text></View>
          <View style={boxStyle}><Text style={boxTitle}>0%</Text><Text>PRODUCTIVITY GAIN</Text></View>
          <View style={boxStyle}><Text style={boxTitle}>0</Text><Text>TOTAL BLOCKS</Text></View>
          <View style={boxStyle}><Text style={boxTitle}>0</Text><Text>STREAK DAYS</Text></View>
        </View>
      </ContentSection>
      <Divider />
      <ContentSection>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Next Milestone</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 4 }}>100 HOURS</Text>
          <Text style={{ color: '#6B4F1D' }}>TIME SAVED GOAL</Text>
        </View>
      </ContentSection>
    </ScreenContainer>
  );
}

const boxStyle = {
  width: '48%',
  backgroundColor: '#F3E2C7',
  borderRadius: 10,
  padding: 16,
  marginBottom: 12,
  alignItems: 'center',
};
const boxTitle = {
  fontSize: 22,
  fontWeight: 'bold',
  marginBottom: 4,
}; 