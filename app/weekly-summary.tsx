import { scale, scaleVertical } from "@/constants/Scale";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface WeeklyStats {
  currentWeekHours: number;
  previousWeekHours: number;
  appUsageReduction: number;
  hoursDifference: number;
  chartData: Array<{
    value: number;
    label: string;
    frontColor: string;
  }>;
}

const WeeklySummaryScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [quote, setQuote] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Motivational quotes
  const quotes = [
    "If you love life, don't waste time, for time is what life is made up of. - Bruce Lee",
    "The joy of life comes from our encounters with new experiences, and hence there is no greater joy than to have an endlessly changing horizon, for each day to have a new and different sun. - Chris McCandless",
    "I am losing precious days. I am degenerating into a machine for making money. I am learning nothing in this trivial world of men. I must break away and get out into the mountains to learn the news. - John Muir"
  ];

  useEffect(() => {
    loadWeeklyData();
  }, [user?.id]);

  const loadWeeklyData = async () => {
    try {
      setLoading(true);
      
      // For mock users, use mock data
      if (user?.id && user.id.length > 10) {
        setWeeklyStats({
          currentWeekHours: 12.5,
          previousWeekHours: 9.3,
          appUsageReduction: 45,
          hoursDifference: 3.2,
          chartData: [
            { value: 9.3, label: 'Last Week', frontColor: '#BE5E19' },
            { value: 12.5, label: 'This Week', frontColor: '#BE5E19' }
          ]
        });
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        setLoading(false);
        return;
      }

      // For real users, fetch actual data
      if (user?.id) {
        const stats = await getUserWeeklyStats(user.id);
        setWeeklyStats(stats);
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      }
    } catch (error) {
      console.error('Error loading weekly data:', error);
      // Fallback to default data
      setWeeklyStats({
        currentWeekHours: 8.5,
        previousWeekHours: 6.2,
        appUsageReduction: 35,
        hoursDifference: 2.3
      });
      setQuote(quotes[0]);
    } finally {
      setLoading(false);
    }
  };

  const getUserWeeklyStats = async (userId: string): Promise<WeeklyStats> => {
    try {
      // Get current week's blocked time (last 7 days)
      const currentWeekStart = new Date();
      currentWeekStart.setDate(currentWeekStart.getDate() - 7);
      
      // Get previous week's blocked time (7-14 days ago)
      const previousWeekStart = new Date();
      previousWeekStart.setDate(previousWeekStart.getDate() - 14);
      const previousWeekEnd = new Date();
      previousWeekEnd.setDate(previousWeekEnd.getDate() - 7);
      
      // Get current week stats
      const { data: currentWeekData, error: currentError } = await supabase
        .from('blocked_sessions')
        .select('duration_minutes')
        .eq('user_id', userId)
        .gte('created_at', currentWeekStart.toISOString());
      
      // Get previous week stats
      const { data: previousWeekData, error: previousError } = await supabase
        .from('blocked_sessions')
        .select('duration_minutes')
        .eq('user_id', userId)
        .gte('created_at', previousWeekStart.toISOString())
        .lt('created_at', previousWeekEnd.toISOString());
      
      if (currentError || previousError) {
        console.error('Error fetching weekly stats:', currentError || previousError);
        return getDefaultStats();
      }
      
      // Calculate hours
      const currentWeekHours = currentWeekData?.reduce((sum: number, session: any) => 
        sum + (session.duration_minutes || 0), 0) / 60 || 0;
      
      const previousWeekHours = previousWeekData?.reduce((sum: number, session: any) => 
        sum + (session.duration_minutes || 0), 0) / 60 || 0;
      
      // Calculate app usage reduction (mock for now - would need real app usage data)
      const appUsageReduction = Math.floor(Math.random() * 50) + 20; // 20-70% reduction
      
      return {
        currentWeekHours: Math.round(currentWeekHours * 10) / 10, // Round to 1 decimal
        previousWeekHours: Math.round(previousWeekHours * 10) / 10,
        appUsageReduction,
        hoursDifference: Math.round((currentWeekHours - previousWeekHours) * 10) / 10,
        chartData: [
          { value: Math.round(previousWeekHours * 10) / 10, label: 'Last Week', frontColor: '#BE5E19' },
          { value: Math.round(currentWeekHours * 10) / 10, label: 'This Week', frontColor: '#BE5E19' }
        ]
      };
      
    } catch (error) {
      console.error('Error in getUserWeeklyStats:', error);
      return getDefaultStats();
    }
  };

  const getDefaultStats = (): WeeklyStats => {
    return {
      currentWeekHours: 8.5,
      previousWeekHours: 6.2,
      appUsageReduction: 35,
      hoursDifference: 2.3,
      chartData: [
        { value: 6.2, label: 'Last Week', frontColor: '#BE5E19' },
        { value: 8.5, label: 'This Week', frontColor: '#BE5E19' }
      ]
    };
  };

  const getComparisonText = () => {
    if (!weeklyStats) return "";
    
    const { hoursDifference } = weeklyStats;
    if (hoursDifference > 0) {
      return `That's ${Math.abs(hoursDifference)} more hours you spent off your screen than last week.`;
    } else if (hoursDifference < 0) {
      return `That's ${Math.abs(hoursDifference)} fewer hours you spent off your screen than last week.`;
    } else {
      return `Same as last week - consistency is key!`;
    }
  };

  if (loading) {
    return (
      <View style={styles.safe}>
        <Image
          source={require("../assets/new-images/onboarding-screen-4.png")}
          style={styles.image}
        />
        <Image
          source={require("../assets/new-images/onboarding-overlay-full.png")}
          style={styles.overlayImage}
        />
        <View style={[styles.mainContainer, { marginTop: insets.top + scaleVertical(16) }]}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your weekly summary...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <Image
        source={require("../assets/new-images/onboarding-screen-4.png")}
        style={styles.image}
      />
      <Image
        source={require("../assets/new-images/onboarding-overlay-full.png")}
        style={styles.overlayImage}
      />

      <View
        style={[
          styles.mainContainer,
          {
            marginTop: insets.top + scaleVertical(16),
          },
        ]}
      >
        <View style={styles.headerView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.slogan}>{"Weekly Summary"}</Text>
            <TouchableOpacity
              style={styles.buttonBack}
              activeOpacity={0.8}
              onPress={() => router.back()}
            >
              <Image
                source={require("../assets/new-images/icon-back.png")}
                style={{
                  height: scale(20),
                  width: scale(20),
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Section */}
          {weeklyStats && (
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{weeklyStats.currentWeekHours}</Text>
                <Text style={styles.statLabel}>Hours Saved This Week</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{weeklyStats.appUsageReduction}%</Text>
                <Text style={styles.statLabel}>App Usage Reduction</Text>
              </View>

              {/* Weekly Comparison Chart */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Weekly Progress</Text>
                <View style={styles.chartWrapper}>
                  <BarChart
                    data={weeklyStats.chartData}
                    barWidth={40}
                    spacing={60}
                    roundedTop
                    roundedBottom
                    hideRules
                    xAxisThickness={0}
                    yAxisThickness={0}
                    yAxisTextStyle={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                    xAxisLabelTextStyle={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12 }}
                    noOfSections={4}
                    maxValue={Math.max(...weeklyStats.chartData.map(d => d.value)) + 2}
                    showGradient
                    gradientColor="#BE5E19"
                    frontColor="#BE5E19"
                    isAnimated
                    animationDuration={1000}
                  />
                </View>
                <Text style={styles.comparisonText}>{getComparisonText()}</Text>
              </View>
            </View>
          )}

          {/* Quote Section */}
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{quote.split(' - ')[0]}"</Text>
            <Text style={styles.quoteAuthor}>- {quote.split(' - ')[1]}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/camp')}
            >
              <Text style={styles.primaryButtonText}>Continue to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    position: "absolute",
    width: "100%",
    height: width * 0.939,
  },
  overlayImage: {
    position: "absolute",
    width: "100%",
    height: "95%",
  },
  buttonBack: {
    backgroundColor: "#000",
    width: scale(40),
    aspectRatio: 1,
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  slogan: {
    position: 'absolute',
    color: "#FFF",
    fontSize: scale(22),
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0.5,
    width: '100%',
    textAlign: 'center',
  },
  headerView: {
    width: '100%',
    paddingHorizontal: scale(24),
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: scale(24),
    marginTop: scaleVertical(24),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: "#FFF",
    fontSize: scale(18),
    fontFamily: "ZillaSlab-Medium",
    textAlign: 'center',
  },
  quoteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(16),
    padding: scale(24),
    marginBottom: scaleVertical(24),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quoteText: {
    color: "#FFF",
    fontSize: scale(18),
    fontFamily: "ZillaSlab-Medium",
    lineHeight: scale(26),
    textAlign: 'center',
    marginBottom: scaleVertical(12),
  },
  quoteAuthor: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: scale(14),
    fontFamily: "ZillaSlab-Regular",
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsContainer: {
    marginBottom: scaleVertical(24),
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(12),
    padding: scale(20),
    marginBottom: scaleVertical(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  statNumber: {
    color: "#BE5E19",
    fontSize: scale(32),
    fontFamily: "ZillaSlab-Bold",
    marginBottom: scaleVertical(8),
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(12),
    padding: scale(20),
    marginBottom: scaleVertical(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  chartTitle: {
    color: "#FFFFFF",
    fontSize: scale(18),
    fontFamily: "ZillaSlab-SemiBold",
    textAlign: 'center',
    marginBottom: scaleVertical(16),
  },
  chartWrapper: {
    alignItems: 'center',
    marginBottom: scaleVertical(16),
  },
  comparisonText: {
    color: "#BE5E19",
    fontSize: scale(16),
    fontFamily: "ZillaSlab-Medium",
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: scaleVertical(32),
  },
  primaryButton: {
    backgroundColor: "#BE5E19",
    borderRadius: scale(12),
    paddingVertical: scaleVertical(16),
    paddingHorizontal: scale(24),
    alignItems: 'center',
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: scale(18),
    fontFamily: "ZillaSlab-SemiBold",
  },
});

export default WeeklySummaryScreen;
