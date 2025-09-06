export interface OnboardingScreen {
  id: number;
  type: 'story' | 'selection' | 'input' | 'slider' | 'final' | 'loading';
  backgroundImage?: string;
  title?: string;
  subtitle?: string;
  content?: string[];
  illustration?: string;
  showProgress?: boolean;
  showSlideIndicator?: boolean;
  button?: {
    text: string;
    action: 'next' | 'submit' | 'complete';
  };
  // For selection screens
  options?: {
    key: string;
    label: string;
    image?: string;
    description?: string;
    icon?: string;
  }[];
  multiSelect?: boolean;
  // For input screens
  inputType?: 'text' | 'number' | 'email';
  placeholder?: string;
  // For slider screens
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    unit?: string;
  };
  // Response tracking
  responseKey: string;
}

export const ONBOARDING_SCREENS: OnboardingScreen[] = [
  // Screen 1: YOU COME FROM MEN WHO BUILT THINGS
  {
    id: 1,
    type: 'story',
    title: 'YOU COME FROM MEN WHO BUILT THINGS',
    content: [
      'Men who hunted on the open plains & told stories next to a fire under a blanket of stars.',
      'The world has changed, but you haven\'t.'
    ],
    illustration: 'onboarding/lineageheads.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_01_viewed'
  },

  // Screen 2: PHONE USE IS STEALING YOUR POTENTIAL
  {
    id: 2,
    type: 'story',
    title: 'PHONE USE IS STEALING YOUR POTENTIAL',
    content: [
      'With every swipe, corporations harvest your attention for profit while that promotion, workout, or relationship is put off'
    ],
    illustration: 'onboarding/builder.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_02_viewed'
  },

  // Screen 3: WHICH IS WHY THIS APP IS AN ACT OF REBELLION
  {
    id: 3,
    type: 'story',
    title: 'WHICH IS WHY THIS APP IS AN ACT OF REBELLION',
    content: [
      'Society wants a bunch of screen-addicted consumers. But you\'re here to create, explore, & build.'
    ],
    illustration: 'onboarding/climber.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_03_viewed'
  },

  // Screen 4: Loading Screen
  {
    id: 4,
    type: 'loading',
    title: 'Let\'s personalize your experience...',
    showProgress: true,
    showSlideIndicator: false,
    responseKey: 'screen_04_loading'
  },

  // Screen 5: What's stealing your time and focus?
  {
    id: 5,
    type: 'selection',
    title: 'What\'s stealing your time and focus?',
    options: [
      { key: 'social', label: 'Social media', icon: 'f' },
      { key: 'porn', label: 'Porn', icon: 'PH' },
      { key: 'youtube', label: 'Youtube', icon: '▷' },
      { key: 'news', label: 'News', icon: '📰' },
      { key: 'gaming', label: 'Gaming', icon: '🎮' },
      { key: 'all', label: 'All of the above', icon: '🚫' }
    ],
    multiSelect: true,
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'digital_traps'
  },

  // Screen 6: When do you find yourself mindlessly scrolling?
  {
    id: 6,
    type: 'selection',
    title: 'When do you find yourself mindlessly scrolling?',
    options: [
      { key: 'morning', label: 'Morning', icon: '☀️' },
      { key: 'work-breaks', label: 'Work breaks', icon: '☕' },
      { key: 'evening', label: 'Evening', icon: '🌅' },
      { key: 'late-night', label: 'Late night', icon: '🌙' },
      { key: 'all-above', label: 'All of the above', icon: '🚫' }
    ],
    multiSelect: true,
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'scrolling_times'
  },

  // Screen 7: What scares you the most about phone addiction?
  {
    id: 7,
    type: 'selection',
    title: 'What scares you the most about phone addiction?',
    options: [
      { key: 'screen-over-people', label: 'Choosing the screen over friends, family & hobbies', icon: '📱' },
      { key: 'brain-fried', label: 'Brain feels fried and scattered', icon: '🧠' },
      { key: 'lazy-pos', label: 'Turning into a lazy POS', icon: '⏰' },
      { key: 'wasting-life', label: 'Feeling like I\'m wasting my life', icon: '⏳' },
      { key: 'all-above', label: 'All of the above', icon: '🚫' }
    ],
    multiSelect: true,
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'phone_fears'
  },

  // Screen 8: What would you rather spend time doing?
  {
    id: 8,
    type: 'selection',
    title: 'What would you rather spend time doing?',
    options: [
      { key: 'fitness', label: 'Fitness', icon: '💪' },
      { key: 'outdoors', label: 'Get outdoors', icon: '🌲' },
      { key: 'learn', label: 'Learn something new', icon: '📚' },
      { key: 'friends-family', label: 'Time with friends & family', icon: '❤️' },
      { key: 'present-moment', label: 'Enjoying with present moment', icon: '😊' }
    ],
    multiSelect: true,
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'preferred_activities'
  },

  // Screen 9: MEN ARE ALMOST 2X MORE LIKELY...
  {
    id: 9,
    type: 'story',
    title: 'MEN ARE ALMOST 2X MORE LIKELY TO BE ADDICTED TO THEIR PHONES THAN WOMEN',
    illustration: 'onboarding/campfire.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_09_stat'
  },

  // Screen 10: UNBOUND BREAKS THE ADDICTION LOOP...
  {
    id: 10,
    type: 'story',
    title: 'UNBOUND BREAKS THE ADDICTION LOOP WITH NO WILLPOWER REQUIRED',
    illustration: 'onboarding/river-crossing.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_10_solution'
  },

  // Screen 11: THE AVERAGE GUY SPENDS 58 DAYS...
  {
    id: 11,
    type: 'story',
    title: 'THE AVERAGE GUY SPENDS 58 DAYS A YEAR LOOKING AT THEIR PHONE',
    illustration: 'onboarding/sunset-valley.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_11_usage_stat'
  },

  // Screen 12: SO UNBOUND LET'S YOU BLOCK...
  {
    id: 12,
    type: 'story',
    title: 'SO UNBOUND LET\'S YOU BLOCK DISTRACTING APPS, WEBSITES, AND PORN WITH ZERO WORKAROUNDS',
    illustration: 'onboarding/cabin.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_12_blocking'
  },

  // Screen 13: IT'S HARD TO MAKE LASTING CHANGES...
  {
    id: 13,
    type: 'story',
    title: 'IT\'S HARD TO MAKE LASTING CHANGES WHEN YOU GO AFTER IT ALONE',
    illustration: 'onboarding/tent-camp.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_13_alone'
  },

  // Screen 14: WITH UNBOUND YOU GET COMMUNITY...
  {
    id: 14,
    type: 'story',
    title: 'WITH UNBOUND YOU GET COMMUNITY & ACCOUNTABILITY BUILT IN',
    illustration: 'onboarding/cabin-building.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_14_community'
  },

  // Screen 15: SO INSTEAD OF REACHING FOR YOUR PHONE...
  {
    id: 15,
    type: 'story',
    title: 'SO INSTEAD OF REACHING FOR YOUR PHONE EVERY TIME YOU HAVE A MOMENT OF BOREDOM...',
    illustration: 'onboarding/tent-reflection.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_15_boredom'
  },

  // Screen 16: AND PROCRASTINATING ON THE THINGS...
  {
    id: 16,
    type: 'story',
    title: 'AND PROCRASTINATING ON THE THINGS THAT MATTER TO YOU',
    illustration: 'onboarding/pastoral.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_16_procrastination'
  },

  // Screen 17: UNBOUND WILL SUPERCHARGE YOUR ABILITY TO FOCUS
  {
    id: 17,
    type: 'story',
    title: 'UNBOUND WILL SUPERCHARGE YOUR ABILITY TO FOCUS',
    illustration: 'onboarding/forest-path.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_17_focus'
  },

  // Screen 18: GIVE YOU MORE ENERGY & TIME...
  {
    id: 18,
    type: 'story',
    title: 'GIVE YOU MORE ENERGY & TIME TO PUT TOWARDS YOUR GOALS',
    illustration: 'onboarding/hammock.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_18_energy'
  },

  // Screen 19: AND EXPAND YOUR SENSE OF PURPOSE & FREEDOM
  {
    id: 19,
    type: 'story',
    title: 'AND EXPAND YOUR SENSE OF PURPOSE & FREEDOM',
    illustration: 'onboarding/campfire-night.png',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_19_purpose'
  },

  // Screen 20: Additional Selection Screen - Your biggest challenge
  {
    id: 20,
    type: 'selection',
    title: 'What\'s your biggest challenge with focus?',
    options: [
      { key: 'distractions', label: 'Too many distractions', icon: '📱' },
      { key: 'procrastination', label: 'Procrastination', icon: '⏰' },
      { key: 'lack-motivation', label: 'Lack of motivation', icon: '😴' },
      { key: 'overwhelm', label: 'Feeling overwhelmed', icon: '🌪️' },
      { key: 'no-clear-goals', label: 'No clear goals', icon: '🎯' }
    ],
    multiSelect: false,
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'biggest_challenge'
  },

  // Screen 21: How committed are you?
  {
    id: 21,
    type: 'slider',
    title: 'How committed are you to changing your relationship with technology?',
    subtitle: 'Rate your commitment level (1-10)',
    sliderConfig: { min: 1, max: 10, step: 1 },
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'commitment_level'
  },

  // Screen 22: Daily phone usage goal
  {
    id: 22,
    type: 'slider',
    title: 'How many hours per day do you want to limit your phone usage to?',
    subtitle: 'Set a realistic daily goal',
    sliderConfig: { min: 1, max: 8, step: 1, unit: 'hours' },
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Set Goal', action: 'next' },
    responseKey: 'daily_phone_goal'
  },

  // Screen 23: Personal motivation input
  {
    id: 23,
    type: 'input',
    title: 'What\'s your personal "why" for this journey?',
    subtitle: 'This will be your anchor in difficult moments',
    inputType: 'text',
    placeholder: 'I want to be present for my family, build my business, become the person I know I can be...',
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Set My Why', action: 'next' },
    responseKey: 'personal_why'
  },

  // Screen 24: Accountability preference
  {
    id: 24,
    type: 'selection',
    title: 'Would you like an accountability partner?',
    options: [
      { key: 'yes-friend', label: 'Yes, a friend', description: 'Someone I know personally' },
      { key: 'yes-stranger', label: 'Yes, someone new', description: 'Matched with another user' },
      { key: 'maybe-later', label: 'Maybe later', description: 'Start solo, add partner later' },
      { key: 'no-solo', label: 'No, just me', description: 'Prefer going solo' }
    ],
    multiSelect: false,
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'accountability_preference'
  },

  // Screen 25: Notification preferences
  {
    id: 25,
    type: 'selection',
    title: 'How often would you like motivational reminders?',
    options: [
      { key: 'none', label: 'None', description: 'I\'ll track myself' },
      { key: 'daily', label: 'Daily', description: 'One reminder per day' },
      { key: 'twice', label: 'Twice daily', description: 'Morning and evening' },
      { key: 'custom', label: 'Custom schedule', description: 'I\'ll set my own times' }
    ],
    multiSelect: false,
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'notification_preference'
  },

  // Screen 26: Emergency plan
  {
    id: 26,
    type: 'selection',
    title: 'What will you do when you feel the urge to mindlessly scroll?',
    options: [
      { key: 'breathe', label: 'Take 3 deep breaths', icon: '🫁' },
      { key: 'walk', label: 'Go for a walk', icon: '🚶' },
      { key: 'water', label: 'Drink water', icon: '💧' },
      { key: 'exercise', label: 'Do some exercise', icon: '💪' },
      { key: 'call', label: 'Call someone', icon: '📞' },
      { key: 'journal', label: 'Write in journal', icon: '📝' }
    ],
    multiSelect: true,
    showProgress: true,
    showSlideIndicator: false,
    button: { text: 'Set Plan', action: 'next' },
    responseKey: 'emergency_plan'
  },

  // Screen 27: IT'S TIME TO GET YOUR LIFE BACK
  {
    id: 27,
    type: 'story',
    title: 'IT\'S TIME TO GET YOUR LIFE BACK',
    illustration: 'onboarding/mountain-lake.png',
    showProgress: false,
    showSlideIndicator: false,
    button: { text: 'Continue', action: 'next' },
    responseKey: 'screen_27_call_to_action'
  },

  // Screen 28: Subscription Screen
  {
    id: 28,
    type: 'story',
    title: 'UNLOCK YOUR JOURNEY',
    subtitle: 'Get focused. Choose your plan.',
    content: [
      '• Auto-block distractions',
      '• Reduce screen time without friction',
      '• Track your reclaimed time',
      '• Private, secure, and easy to use',
      '• Level up through progress milestones'
    ],
    showProgress: false,
    showSlideIndicator: false,
    button: { text: 'Choose Plan', action: 'next' },
    responseKey: 'subscription_viewed'
  },

  // Screen 29: Final Screen - Notification Permission
  {
    id: 29,
    type: 'final',
    title: 'Ready to begin your journey?',
    content: [
      'We\'ll send you helpful reminders and progress updates to keep you on track.',
      'Your digital freedom journey starts now!'
    ],
    showProgress: false,
    showSlideIndicator: false,
    button: { text: 'Allow Notifications & Begin', action: 'complete' },
    responseKey: 'onboarding_completed'
  }
];

// Default response structure for all 29 screens
export const getDefaultResponses = () => ({
  screen_01_viewed: true,
  screen_02_viewed: true,
  screen_03_viewed: true,
  screen_04_loading: true,
  digital_traps: [] as string[],
  scrolling_times: [] as string[],
  phone_fears: [] as string[],
  preferred_activities: [] as string[],
  screen_09_stat: true,
  screen_10_solution: true,
  screen_11_usage_stat: true,
  screen_12_blocking: true,
  screen_13_alone: true,
  screen_14_community: true,
  screen_15_boredom: true,
  screen_16_procrastination: true,
  screen_17_focus: true,
  screen_18_energy: true,
  screen_19_purpose: true,
  biggest_challenge: '',
  commitment_level: 5,
  daily_phone_goal: 3,
  personal_why: '',
  accountability_preference: '',
  notification_preference: '',
  emergency_plan: [] as string[],
  screen_27_call_to_action: true,
  subscription_viewed: true,
  onboarding_completed: true
});

export type OnboardingResponses = ReturnType<typeof getDefaultResponses> & {
  [key: string]: any;
};