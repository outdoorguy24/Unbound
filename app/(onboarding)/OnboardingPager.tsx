import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    heading: "YOU COME FROM WHO HUNTED ON OPEN PLAINS. WHO STARTED FIRES WITH STONE. WHO TOLD STORIES UNDER STARS.",
    subheading: "NOW WE SCROLL. WE SWIPE. WE SIT.",
    body: "THE WORLD HAS CHANGED BUT THE FIRE INSIDE YOU HASN'T.",
  },
  {
    heading: "TECHNOLOGY HAS BENEFITS. BUT IT'S STEALING YOUR LIFE.",
    subheading: undefined,
    body: "CHEAP DOPAMINE. CONSTANT DISTRACTION. YOU'RE NOT BROKEN—YOU'RE OVERSTIMULATED. YOU KNOW WHAT YOU SHOULD BE DOING... BUT YOU SCROLL INSTEAD. THEN COMES THE GUILT. AND MORE SCROLLING TO ESCAPE THE GUILT.",
  },
  {
    heading: "EVERY MINUTE ON PORN OR SOCIAL MEDIA... IS A MINUTE YOU'LL NEVER GET BACK.",
    subheading: undefined,
    body: "YOU'RE GIVING AWAY YOUR LIFE — ONE SWIPE AT A TIME — TO BILLIONAIRE TECH OVERLORDS WHO DON'T CARE ABOUT YOU. THIS IS A WAR FOR YOUR ATTENTION.",
  },
  {
    heading: "THIS APP IS AN ACT OF REBELLION.",
    subheading: undefined,
    body: "YOU'RE NOT HERE ON EARTH TO BE A MINDLESS CONSUMER. YOU'RE HERE TO WAKE UP. TO MAKE THE MOST OF THESE FLEETING MOMENTS. TO CREATE MORE THAN YOU CONSUME.",
  },
  {
    heading: "IT'S TIME TO REMEMBER WHO YOU ARE.",
    subheading: undefined,
    body: "PICK UP THE PAINTBRUSH AND GRAB THE HAMMER. LACE UP YOUR SHOES OR BOXING GLOVES. GET A SPLINTER. WALK BAREFOOT IN THE GRASS. BECOME THE MAN YOU WERE MEANT TO BE. MAKE YOUR GRANDFATHER PROUD.",
  },
  {
    heading: "WHAT'S STEALING YOUR TIME?",
    subheading: undefined,
    body: "SOCIAL MEDIA, PORN, YOUTUBE, NEWS/REDDIT, GAMING, ALL OF THE ABOVE.",
  },
  {
    heading: "WHEN ARE YOU MOST VULNERABLE?",
    subheading: "KNOWLEDGE IS POWER. WHEN DOES WEAKNESS STRIKE?",
    body: "MORNING, WORK BREAKS, EVENING, LATE NIGHT.",
  },
  {
    heading: "HERE'S HOW WE'LL HELP YOU RECLAIM YOUR TIME",
    subheading: undefined,
    body: "SET YOUR SCHEDULE\nCHOOSE WHEN TO DEFEND YOUR ATTENTION.\n\nWE BLOCK THE DISTRACTIONS\nZERO ACCESS. ZERO EXCUSES. ZERO WAY OUT.\n\nYOU LIVE YOUR LIFE",
  },
];

function OnboardingPage({ heading, subheading, body, isLast, onNext }: any) {
  return (
    <View style={styles.page}>
      <Text style={styles.heading}>{heading}</Text>
      {subheading && <Text style={styles.subheading}>{subheading}</Text>}
      <Text style={styles.body}>{body}</Text>
      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>{isLast ? 'Continue' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function OnboardingPager() {
  const router = useRouter();
  const flatListRef = React.useRef<FlatList>(null);
  const [page, setPage] = React.useState(0);

  const handleNext = () => {
    if (page < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: page + 1 });
      setPage(page + 1);
    } else {
      router.replace('/(onboarding)/paywall');
    }
  };

  return (
    <FlatList
      ref={flatListRef}
      data={onboardingData}
      keyExtractor={(_, i) => i.toString()}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={e => {
        const newPage = Math.round(e.nativeEvent.contentOffset.x / width);
        setPage(newPage);
      }}
      renderItem={({ item, index }) => (
        <OnboardingPage
          heading={item.heading}
          subheading={item.subheading}
          body={item.body}
          isLast={index === onboardingData.length - 1}
          onNext={handleNext}
        />
      )}
      style={{ flex: 1 }}
      getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
    />
  );
}

const styles = StyleSheet.create({
  page: {
    width,
    height,
    backgroundColor: '#F3E2C7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  heading: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    lineHeight: 32,
  },
  subheading: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    lineHeight: 28,
  },
  body: {
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Bold',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    lineHeight: 28,
  },
  button: {
    backgroundColor: '#5C3D18',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#F3E2C7',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Vollkorn-Bold',
  },
}); 