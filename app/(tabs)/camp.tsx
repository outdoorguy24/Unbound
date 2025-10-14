import { scale, scaleVertical } from "@/constants/Scale";
import { useAuth } from "@/contexts/AuthContext";
import { getCommunityStats, getDaysWithoutPorn, getPhoneUsageReductionPercentage, getStreak, getTotalBlockedTime } from "@/lib/userTracking";
import { Feather } from "@expo/vector-icons"; // expo install @expo/vector-icons
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import RenderHTML, { defaultSystemFonts } from "react-native-render-html";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhoneUsageTracker from "../services/PhoneUsageTracker";

import { BarChart } from "react-native-gifted-charts";
const { width } = Dimensions.get("window");
enum ViewTypes {
  Monthly = "Monthly",
  AllTime = "All Time"
}


const CampScreen = () => {
  const [viewType, setViewType] = useState(ViewTypes.Monthly);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  // Real data state
  const [userStats, setUserStats] = useState({
    savedToday: 0,
    totalSaved: 0,
    daysWithoutPorn: 0,
    streakDays: 0,
    monthlyHours: 0,
    allTimeHours: 0,
    phoneUsageReduction: 0,
  });
  const [communityStats, setCommunityStats] = useState({
    totalUsers: 1000,
    totalTimeSaved: 50000,
    weeklyHours: 1200,
    completedBlocks: 10000,
    goalHitRate: 80,
  });
  const [loading, setLoading] = useState(true);

  // Fetch real data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Collect fresh phone usage data if tracking is active
        if (PhoneUsageTracker.isTrackingActive()) {
          await PhoneUsageTracker.collectDataNow(user.id);
        }
        // Get user streak data
        const streakData = await getStreak(user.id);
        
        // Get time saved today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const timeSavedToday = await getTotalBlockedTime(user.id, today, new Date()) || 0;
        
        // Get time saved this month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthlyTime = await getTotalBlockedTime(user.id, startOfMonth, new Date()) || 0;
        
        // Get all-time total
        const allTimeStart = new Date(2000, 0, 1);
        const allTimeMinutes = await getTotalBlockedTime(user.id, allTimeStart, new Date()) || 0;
        
        // Get days without porn
        const daysWithoutPorn = await getDaysWithoutPorn(user.id);
        
        // Get phone usage reduction percentage
        const phoneUsageReduction = await getPhoneUsageReductionPercentage(user.id);
        
        // Get community stats
        const communityData = await getCommunityStats();
        
        setUserStats({
          savedToday: Math.round(timeSavedToday / 60 * 10) / 10, // Convert to hours with 1 decimal
          totalSaved: Math.round(allTimeMinutes / 60 * 10) / 10, // Convert to hours with 1 decimal
          daysWithoutPorn,
          streakDays: streakData.current_streak || 0,
          monthlyHours: Math.round(monthlyTime / 60 * 10) / 10,
          allTimeHours: Math.round(allTimeMinutes / 60 * 10) / 10,
          phoneUsageReduction,
        });
        
        setCommunityStats({
          totalUsers: communityData.totalUsers,
          totalTimeSaved: communityData.totalTimeSaved,
          weeklyHours: Math.round(communityData.totalTimeSaved / 60), // Convert minutes to hours
          completedBlocks: Math.round(communityData.totalTimeSaved / 60), // Estimate based on time
          goalHitRate: 80, // Keep as static for now
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Keep fallback values on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const data = [
    { value: 60, label: "Week 1" },
    { value: 45, label: "Week 2" },
    { value: 60, label: "Week 3" },
    { value: 45, label: "Week 4" },
  ];

  const dataAllTime = [
    { value: 50, label: "Oct 24" },
    { value: 40, label: "Nov 24" },
    { value: 55, label: "Dec 24" },
    { value: 20, label: "Jan 25" },
  ];

  type Stat = { label: string; value: string };
  const SMALL_CARDS: Stat[] = [
    { label: "Saved today", value: `${userStats.savedToday}h` },
    { label: "Total saved", value: `${userStats.totalSaved}h` },
    { label: "Days without porn", value: userStats.daysWithoutPorn.toString() },
    { label: "Streak days", value: userStats.streakDays.toString() },
  ];

  function ChartsCard() {
      return (
        <View style={{ margin: scaleVertical(16), overflow: 'hidden' }}>
            <BarChart
              data={data}
              barWidth={15}
              initialSpacing={40}
              spacing={50}
              barBorderRadius={3}
              frontColor={"#FFD099"}
              yAxisTextStyle={{ 
                color: "rgba(255, 255, 255, 0.2)",
                fontSize: 12,
                fontFamily: "ZillaSlab-Regular",
              }}
              xAxisLabelTextStyle={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: 14,
                fontFamily: "ZillaSlab-Medium",
              }}
              yAxisColor={"rgba(255, 255, 255, 0.2)"}
              xAxisColor={"rgba(255, 255, 255, 0.2)"}
              maxValue={100}
              stepValue={20}
              hideRules={false}
              rulesType="dashed"
              rulesColor={"rgba(255, 255, 255, 0.2)"}
              formatYLabel={(val) => (val === '0' ? `${val} hr` : `${val}`)}
            />
          </View>
      )
  }

  function ChartsAllTimeCard() {
      return (
        <View style={{ margin: scaleVertical(16), overflow: 'hidden' }}>
            <BarChart
              data={dataAllTime}
              barWidth={15}
              initialSpacing={40}
              spacing={50}
              barBorderRadius={3}
              frontColor={"#FFD099"}
              yAxisTextStyle={{ 
                color: "rgba(255, 255, 255, 0.2)",
                fontSize: 12,
                fontFamily: "ZillaSlab-Regular",
              }}
              xAxisLabelTextStyle={{
                color: "rgba(255, 255, 255, 0.6)",
                fontSize: 14,
                fontFamily: "ZillaSlab-Medium",
              }}
              yAxisColor={"rgba(255, 255, 255, 0.2)"}
              xAxisColor={"rgba(255, 255, 255, 0.2)"}
              maxValue={100}
              stepValue={20}
              hideRules={false}
              rulesType="dashed"
              rulesColor={"rgba(255, 255, 255, 0.2)"}
              formatYLabel={(val) => (val === '0' ? `${val} hr` : `${val}`)}
            />
          </View>
      )
  }

  function StatsCard() {
    return <>
    {/* Grid of small cards */}
        <View style={{ 
            flexDirection: "row", 
            flexWrap: "wrap", 
            justifyContent: "space-between", 
            marginTop: scale(20) 
          }}>
          {SMALL_CARDS.map((item) => (
            <View
              key={item.label}
              style={{
                width: "48%",
                borderRadius: 6,
                padding: scale(16),
                marginBottom: scale(8),
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <View style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}>
                <Image source={require("../../assets/new-images/stats-bg.png")} 
                  style={{
                    width: '100%',
                    height: '100%',
                  }} />
              </View>
              <Text
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: scale(15),
                  fontFamily: "ZillaSlab-Bold",
                }}
              >
                {item.label}
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: scale(20),
                  fontFamily: "ZillaSlab-SemiBold",
                  marginTop: scale(2),
                }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Large card */}
        <View
          style={{
            borderRadius: 6,
            padding: scale(16),
            marginTop: scale(4),
            justifyContent: "center",
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <View style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}>
            <Image source={require("../../assets/new-images/stats-bg.png")} 
              style={{
                width: '100%',
                height: '100%',
              }} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: scale(14),
                fontFamily: "ZillaSlab-Bold",
              }}
            >
              Phone use since downloading Unbound
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: scale(2), justifyContent: 'space-between' }}>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: scale(20),
                  fontFamily: "ZillaSlab-SemiBold",
                }}
              >
                {userStats.phoneUsageReduction}%
              </Text>
              
              <Image
                source={require("../../assets/new-images/dashboard-green-down-arrow.png")}
                style={{
                  width: scale(16),
                  height: scale(16),
                  marginLeft: scaleVertical(6),
                }}
              />
            </View>
          </View>
          <Image
            source={require("../../assets/new-images/dashboard-share.png")}
            style={{
              position: 'absolute',
              width: scale(16),
              height: scale(16),
              right: scale(16),
            }}
          />
        </View>
        </>
  }

  type Row = {
    label: string;
    done?: boolean;
    onPress?: () => void;
  };

  function ChecklistCard() {
    const rows: Row[] = [
      { label: "Set location", done: true },
      { label: "Turn notifications on", done: true, onPress: () => {} },
      { label: "Start your first focus", done: false },
      { label: "Share your first milestone", done: false },
    ];

    return (
      <>
        <View style={{
          flexDirection: 'row', 
          alignItems: 'center',
          marginTop: scale(20)
        }}>

          <Image
            source={require("../../assets/new-images/shield-done.png")}
            style={{
              width: scale(24),
              height: scale(24),
              marginRight: scaleVertical(10),
            }}
            resizeMode={"contain"}
          />
          <Text style={{
            color: "#FFFFFF",
            fontSize: scale(22),
            fontFamily: "ZillaSlab-Medium",
          }}>
          {"Finish Your Setup"}
          </Text> 
        </View>


      <ImageBackground
        source={require("../../assets/new-images/finish-setup-bg.png")}
        style={{
          marginTop: scale(16),
          padding: scale(24),
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
          overflow: "hidden",
          // alignContent: 'center',
          // justifyContent: 'center',
        }}
        resizeMode={"cover"}
      >
          <View
            style={{
              position: 'absolute',
              top: 15,
              bottom: 10,
              width: scale(193),
              right: 13,
              // backgroundColor: 'red'
            }}>

            <Image
              source={require("../../assets/new-images/finish-setup-bg-pattern.png")}
              style={{
                height: "100%",
                width: "100%",
              }}
              resizeMode={"contain"}
            />
          </View>
          
        {/* Background layer with subtle vignette + badges */}
        <View
          style={{
            // backgroundColor: "blue",
          }}
        >
          {rows.map((r, idx) => {

            return (
              <Pressable
                key={r.label}
                onPress={r.onPress}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: scale(10),
                }}
              >
                {/* check bubble */}
                <View
                  style={{
                    width: scale(24),
                    height: scale(24),
                    borderRadius: scale(12),
                    backgroundColor: '#0AB337',
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: scale(12),
                    opacity: r.done ? 1 : 0.4,
                  }}
                >
                  <Feather name="check" size={16} color="#0B0B0B" />
                </View>

                {/* label */}
                <Text
                  style={{
                    color: '#fff',
                    fontSize: scale(14),
                    fontFamily: "ZillaSlab-Medium",
                  }}
                >
                  {r.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ImageBackground>
      </>
    );
  }

  function MostUsedAppsCard() {

    type AppItem = {
      id: string;
      name: string;
      icon: any;
      minutes: number;
    };

    const DATA: AppItem[] = [
      { id: "1", name: 'Facebook', icon: require("../../assets/new-images/facebook-icon.png"), minutes: 10 * 60 + 54 },
      { id: "2", name: 'YouTube Music', icon: require("../../assets/new-images/youtube-icon.png"), minutes: 3 * 60 + 34},
      { id: "3", name: 'Telegram', icon: require("../../assets/new-images/telegram-icon.png"), minutes: 2 * 60 + 12},
      { id: "4", name: 'LinkedIn', icon: require("../../assets/new-images/linkedin-icon.png"), minutes: 1 * 60 + 44},
    ];

    const CARD_PADDING = scale(20);
    const BAR_HEIGHT = 8;

    const minutesToLabel = (mins: number) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      if (h <= 0) return `${m}m`;
      return `${h}h ${m}m`;
    };

    const maxMinutes = DATA.reduce((max, a) => (a.minutes > max ? a.minutes : max), 1);

    const UsageRow = ({ item, maxMinutes }: { item: AppItem; maxMinutes: number }) => {
      const pct = Math.max(2, Math.round((item.minutes / maxMinutes) * 70));
      return (
        <View style={{ paddingHorizontal: CARD_PADDING, paddingVertical: scale(8) }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Icon circle */}
            <Image
              source={item.icon}
              style={{
                width: scale(40),
                height: scale(40),
                marginRight: scaleVertical(10),
              }}
              resizeMode={"contain"}
            />

            {/* Title + bar + time */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: scale(16),
                  fontFamily: "ZillaSlab-Medium",
                  letterSpacing: 0.5,
                }}
              >
                {item.name}
              </Text>

              {/* Progress bar */}
              <View
                style={{
                  marginTop: scale(3),
                  borderRadius: BAR_HEIGHT,
                  overflow: "hidden",
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <View
                  style={{
                    width: `${pct}%`,
                    height: 4,
                    borderRadius: BAR_HEIGHT,
                    backgroundColor: "rgba(255,255,255,0.5)",
                  }}
                />

                {/* Duration */}
                <Text
                  style={{
                    flex: 1,
                    marginLeft: 12,
                    color: "rgba(255,255,255,0.5)",
                    fontSize: scale(12),
                    fontFamily: "ZillaSlab-Regular",
                  }}
                >
                  {minutesToLabel(item.minutes)}
                </Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View
            style={{
              marginTop: scale(16),
              height: 1,
              backgroundColor: "#D9D9D9",
              opacity: 0.2,
              marginLeft: scale(50),
            }}
          />
        </View>
      );
    };
    return (
      <>
      <View style={{
          flexDirection: 'row', 
          alignItems: 'center',
          marginTop: scale(36),
        }}>
          <Image
            source={require("../../assets/new-images/most-used-apps.png")}
            style={{
              width: scale(24),
              height: scale(24),
              marginRight: scaleVertical(10),
            }}
            resizeMode={"contain"}
          />
          <Text style={{
            color: "#FFFFFF",
            fontSize: scale(22),
            fontFamily: "ZillaSlab-Medium",
            flex: 1,
          }}>
          {"Most used apps"}
          </Text> 
          <Image
            source={require("../../assets/new-images/dashboard-up-arrow.png")}
            style={{
              width: scale(24),
              height: scale(24),
              marginRight: scaleVertical(10),
            }}
            resizeMode={"contain"}
          />
        </View>

      <ImageBackground
        source={require('../../assets/new-images/most-used-app-bg.png')}
        style={{
          marginTop: scale(16),
          borderRadius: 6,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
          overflow: "hidden",
        }}
      >

        <FlatList
          style={{marginVertical: scale(20)}}
          data={DATA}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <UsageRow item={item} maxMinutes={maxMinutes} />}
          ListFooterComponent={
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {}}
              style={{ paddingHorizontal: CARD_PADDING }}
            >
              <Text
                style={{
                  color: "#FFCA91",
                  fontSize: scale(16),
                  fontFamily: "ZillaSlab-Medium",
                }}
              >
                Show more
              </Text>
            </TouchableOpacity>
          }
        />


      </ImageBackground>
      </>
    );
  }

  function CommunityStatsCard() {
    const systemFonts = [...defaultSystemFonts, 'ZillaSlab-Medium', 'ZillaSlab-Bold']

    const data = [
      {
        id: "1",
        html: `<span> <strong>${communityStats.totalUsers}</strong> guys reclaimed over <strong>${communityStats.weeklyHours.toLocaleString()}</strong> hours of their time this week</span>`,
      },
      {
        id: "2",
        html: `<span>Together we've completed <strong>${communityStats.completedBlocks.toLocaleString()}</strong> focus blocks.</span>`,
      },
      {
        id: "3",
        html: `<span><strong>${communityStats.goalHitRate}</strong>% of men hit their focus goal today</span>`,
      },
    ];

    const StatCard = ({ item }: any) => (
      <ImageBackground 
        source={require('../../assets/new-images/stats-bg.png')}
        style={{
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: 6,
          padding: scale(16),
          width: (width - scale(24)) / 2.5,
        }}>

        <View style={{
          // backgroundColor: 'pink'
        }}>
          <RenderHTML
            source={{ html: item.html }}
            systemFonts={systemFonts} 
            tagsStyles={{
              span: { fontFamily: "ZillaSlab-Medium", fontSize: scale(14), color: "#fff" },
              strong: { fontFamily: "ZillaSlab-Bold", fontSize: scale(16), color: "#fff" },
            }}
          />
        </View>
        {/* <Text style={{
          color: "#fff",
          fontSize: scale(14),
          fontFamily: "ZillaSlab-Medium",
        }}>
          {item.text}
        </Text> */}
      </ImageBackground>
    );



    return (
      <>
      <View style={{
          flexDirection: 'row', 
          alignItems: 'center',
          marginTop: scale(50),
        }}>
          <Image
            source={require("../../assets/new-images/community-stats.png")}
            style={{
              width: scale(24),
              height: scale(24),
              marginRight: scaleVertical(10),
            }}
            resizeMode={"contain"}
          />
          <Text style={{
            color: "#FFFFFF",
            fontSize: scale(22),
            fontFamily: "ZillaSlab-Medium",
            flex: 1,
          }}>
          {"Community stats"}
          </Text>

        </View>

        <FlatList
          contentContainerStyle={{marginTop: scale(16)}}
          data={data}
          renderItem={StatCard}
          ItemSeparatorComponent={() => <View style={{ width: scale(12) }} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  }

  function ResponseCard() {
    return (
      <>
        <View
          // source={require('../../assets/new-images/most-used-app-bg.png')}
          style={{
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: 6,
            padding: scale(20),
            marginTop: scale(16),
          }}
        >

          <View style={{
          flexDirection: 'row', 
          alignItems: 'center',
          marginBottom: scale(28),
        }}>
          <Text style={{
            color: "#FFFFFF",
            fontSize: scale(22),
            fontFamily: "ZillaSlab-Medium",
            flex: 1,
          }}>
          {"What have you replaced screen time with?"}
          </Text>

          </View>
          {/* Response box */}
          <TextInput
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.7)", 
              borderRadius: 6,
              paddingVertical: scale(18),
              paddingHorizontal: scale(20),
              color: "#000",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Medium",
            }}
            placeholder="Your response..."
            placeholderTextColor="rgba(0,0,0,0.4)"
          />

          <TouchableOpacity
            style={[
              styles.primaryRespBtn,
            ]}
            onPress={() => {}}
            activeOpacity={0.9}
          >

            <View style={{
              flexDirection: 'row', 
              alignItems: 'center',
            }}>
              <Image
                source={require('../../assets/new-images/send-icon.png')}
                style={{
                  width: scale(16),
                  height: scale(16),
                  marginRight: scale(12),
                }}
              />
              <Text style={styles.primaryText}>{"Submit"}</Text>
            </View>
          </TouchableOpacity>


           {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: scaleVertical(62), marginBottom: scaleVertical(16) }}>
            <Image
              source={require('../../assets/new-images/user-dummy-img.png')}
              style={{
                width: scale(40),
                height: scale(40),
                borderRadius: scale(20),
                marginRight: scale(12),
              }}
            />
            <View>
              <Text style={{ 
                color: "#fff", 
                fontSize: scale(18),
                fontFamily: "ZillaSlab-Medium",
              }}>
                Mark in Denver
              </Text>
              {/* <Text style={{ 
                color: "rgba(255, 255, 255, 0.5)", 
                fontSize: scale(14),
                fontFamily: "ZillaSlab-Regular", 
                marginTop: scale(2) 
              }}>
                4 hours ago
              </Text> */}
            </View>
          </View>

          {/* Message */}
          <Text style={{ 
            color: "#fff", 
            fontSize: scale(16),
            fontFamily: "ZillaSlab-Medium", 
            marginBottom: scaleVertical(10),
          }}>
            “Finally called my mom to say hi instead of doomscrolling”
          </Text>

        </View>

        
      </>
    );
  }
  
  return (
    <View style={styles.safe}>
      <Image
        source={require("../../assets/new-images/onboarding-screen-4.png")}
        style={styles.image}
      />
      <Image
        source={require("../../assets/new-images/onboarding-overlay-full.png")}
        style={styles.overlayImage}
      />

      <ScrollView 
        style={{
          marginTop: insets.top + scaleVertical(24),
          marginHorizontal: scale(24),
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <TouchableOpacity style={{
            flexDirection: 'row', 
            alignItems: 'center',
            alignSelf: 'flex-start',
          }}
          onPress={() => setViewType(viewType === ViewTypes.Monthly ? ViewTypes.AllTime : ViewTypes.Monthly)}
          >
          <Text style={{
            color: "#FFFFFF",
            fontSize: scale(24),
            fontFamily: "ZillaSlab-Medium",
          }}>
          {viewType === ViewTypes.Monthly ? "This month" : "Your all-time progress"}
          </Text>
            
          <Image
            source={require("../../assets/new-images/dashboard-down-arrow.png")}
            style={{
              width: scale(24),
              height: scale(24),
              marginLeft: scaleVertical(8),
            }}
            resizeMode={"contain"}
          />
        </TouchableOpacity>

        <View style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 8,
            marginTop: scaleVertical(8),
          }}>
          <Text style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: scale(16),
              fontFamily: "ZillaSlab-Medium",
              marginTop: scaleVertical(16),
              marginHorizontal: scaleVertical(16),
            }}>
            Your focus progress
          </Text>

          <View style={{
              flexDirection: 'row', 
              alignItems: 'center',
            }}>
            <Text style={{
              color: "#FFFFFF",
              fontSize: scale(18),
              fontFamily: "ZillaSlab-Bold",
              marginLeft: scaleVertical(16),
            }}>
            {viewType === ViewTypes.Monthly ? `${userStats.monthlyHours} hrs` : `${userStats.allTimeHours} hrs`}
            </Text>
            <Text style={{
              color: "rgba(255, 255, 255, 0.5)",
                fontSize: scale(12),
                fontFamily: "ZillaSlab-Bold",
                marginLeft: scaleVertical(6),
              }}>
              {viewType === ViewTypes.Monthly ? "reclaimed this month" : "total focused time since joining"}
            </Text>
          </View>

          {viewType === ViewTypes.Monthly ? <ChartsCard /> : <ChartsAllTimeCard />}
        </View>

        <StatsCard />
        <ChecklistCard />
        <MostUsedAppsCard />
        <CommunityStatsCard />
        <ResponseCard />

      </ScrollView>
      
      <TouchableOpacity
        style={[
          styles.primaryBtn,
        ]}
        onPress={() => { router.navigate('/defend'); }}
        activeOpacity={0.9}
      >

        <View style={{flexDirection: 'row'}}>
          <Image
            source={require('../../assets/new-images/start-focus-icon.png')}
            style={{
              width: scale(24),
              height: scale(24),
              marginRight: scale(12),
            }}
          />
          <Text style={styles.primaryText}>{"Defend your time"}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  image: { 
    position: "absolute", 
    width: "100%", 
    height: width * 0.939 
  },
  overlayImage: { 
    position: "absolute", 
    width: "100%", 
    height: "100%" 
  },
  primaryBtn: {
    alignItems: 'center',
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    paddingVertical: scaleVertical(20),
    marginVertical: scale(24),
    marginHorizontal: scale(24),
  },
  primaryRespBtn: {
    alignItems: 'center',
    backgroundColor: '#BE5E19',
    borderRadius: 6,
    paddingVertical: scaleVertical(12),
    marginTop: scale(16),
    marginHorizontal: scale(46),
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: scale(18),
    textAlign: "center",
    fontFamily: "ZillaSlab-SemiBold",
    letterSpacing: 0,
  },
});

export default CampScreen;


// import AchievementLevel from "@/components/AchievementLevel";
// import { ScreenContainer } from "@/components/ui/ScreenContainer";
// import { COLORS, SPACING } from "@/constants/theme";
// import { useAuth } from "@/contexts/AuthContext";
// import { resetUserPairing } from "@/lib/partnerMatching";
// import { supabase } from "@/lib/supabaseClient";
// import { getUserProfile } from "@/lib/supabaseUserProfile";
// import { getCommunityStats, getPartnerData, getStreak, getTotalBlockedTime } from "@/lib/userTracking";
// import { registerForPushNotificationsAsync } from "@/utils/notifications";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Link, useRouter } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import { Alert, Animated, AppState, Easing, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// // 1. Format minutes as "X hours, Y minutes"
// function formatTimeSaved(minutes: number): string {
//   if (!minutes || minutes < 1) return "0 minutes";
//   const h = Math.floor(minutes / 60);
//   const m = minutes % 60;
//   if (h === 0) return `${m} minutes`;
//   if (m === 0) return `${h} hours`;
//   return `${h} hours, ${m} minutes`;
// }

// // 2. Motivational text based on time saved
// function getTimeComparison(minutes: number): string {
//   if (minutes <= 120) return "That's enough time to read a book chapter.";
//   if (minutes <= 300) return "That's enough time to learn a new skill.";
//   if (minutes <= 600) return "That's enough time to take a cooking class.";
//   return "That's enough time to climb a mountain.";
// }

// // 3. Partner status based on streak
// function getPartnerStatus(streakDays: number): string {
//   if (streakDays <= 3) return "Getting started";
//   if (streakDays <= 10) return "Building momentum";
//   if (streakDays <= 20) return "Strong this week";
//   return "Unstoppable";
// }

// export default function CampScreen() {
//   const { user: contextUser } = useAuth();
//   const [user, setUser] = useState<any>(null);
//   const [partner, setPartner] = useState<any>(null);
//   const [community, setCommunity] = useState<any>({ totalUsers: 0, totalTimeSaved: 0 });
//   const [loading, setLoading] = useState(true);
//   const spinValue = useRef(new Animated.Value(0)).current;
//   const router = useRouter();

//   useEffect(() => {
//     const requestNotificationPermission = async () => {
//       const NOTIFICATION_PERMISSION_REQUESTED_KEY = '@notification_permission_requested';
//       try {
//         const hasRequested = await AsyncStorage.getItem(NOTIFICATION_PERMISSION_REQUESTED_KEY);
//         if (hasRequested) {
//           return; // Don't ask again
//         }

//         // Mark as requested so we don't ask again
//         await AsyncStorage.setItem(NOTIFICATION_PERMISSION_REQUESTED_KEY, 'true');

//         const token = await registerForPushNotificationsAsync();
//         if (token && user?.id) {
//           console.log('Push notification token obtained on Camp screen:', token);
//           const { error } = await supabase
//             .from('user_profiles')
//             .update({ push_token: token })
//             .eq('user_id', user.id);

//           if (error) {
//             console.error('Error saving push token from Camp screen:', error);
//           } else {
//             console.log('Push token saved to database from Camp screen');
//           }
//         }
//       } catch (e) {
//         console.error('Failed to request notification permission:', e);
//       }
//     };

//     if (contextUser?.id) {
//       requestNotificationPermission();
//     }
//   }, [contextUser?.id]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       // Get current user
//       const { data: authData } = await supabase.auth.getUser();
//       const supaUser = authData?.user;

//       if (!supaUser) {
//         setLoading(false);
//         return;
//       }

//       // Get user profile
//       const userProfile = await getUserProfile(supaUser.id);

//       // Get real streak data
//       const streakData = await getStreak(supaUser.id);
//       const streakDays = streakData.current_streak || 0;

//       // Calculate time saved this week (from Monday to Sunday)
//       const now = new Date();
//       const startOfWeek = new Date(now);
//       startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
//       startOfWeek.setHours(0, 0, 0, 0);
      
//       const timeSavedThisWeek = await getTotalBlockedTime(supaUser.id, startOfWeek, now) || 0;

//       // Calculate all-time total blocked time (in minutes)
//       const allTimeStart = new Date(2000, 0, 1); // Arbitrary far past date
//       const totalBlockedMinutes = await getTotalBlockedTime(supaUser.id, allTimeStart, now) || 0;
//       const totalBlockedHours = Math.floor(totalBlockedMinutes / 60);

//       setUser({
//         userId: supaUser.id,
//         firstName: userProfile?.first_name || "Warrior",
//         streakDays,
//         timeSavedThisWeek,
//         totalBlockedHours,
//       });

//       // Get real partner data
//       const partnerData = await getPartnerData(supaUser.id);
      
//       if (partnerData) {
//         setPartner({
//           ...partnerData,
//           status: getPartnerStatus(partnerData.streakDays),
//         });
//       } else {
//         setPartner(null);
//       }

//       // Get real community stats
//       const communityStats = await getCommunityStats();
//       setCommunity(communityStats);

//     } catch (error) {
//       console.error("🏕️ Camp: Error fetching data:", error);
//       // Set fallback data on error
//       const { data: authData } = await supabase.auth.getUser();
//       const supaUser = authData?.user;
//       setUser({
//         userId: supaUser?.id || contextUser?.id,
//         firstName: "Warrior",
//         streakDays: 1,
//         timeSavedThisWeek: 0,
//         totalBlockedHours: 0,
//       });
//       setPartner(null);
//       setCommunity({
//         totalUsers: 1000,
//         totalTimeSaved: 50000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchData();
//   }, [contextUser]);

//   // Add AppState listener to refresh data on resume
//   useEffect(() => {
//     const appState = { current: AppState.currentState };
//     const subscription = AppState.addEventListener('change', nextAppState => {
//       if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
//         fetchData();
//       }
//       appState.current = nextAppState;
//     });
//     return () => subscription.remove();
//   }, []);

//   useEffect(() => {
//     const spin = () => {
//       spinValue.setValue(0);
//       Animated.timing(spinValue, {
//         toValue: 1,
//         duration: 1500,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       }).start(() => spin());
//     };

//     if (loading) {
//       spin();
//     }
//   }, [loading, spinValue]);

//   const handleReset = async () => {
//     if (!user?.userId) return;
//     const success = await resetUserPairing(user.userId);
//     if (success) {
//       Alert.alert("Pairing Reset", "Your pairing status has been reset. Finding you a new partner...");
//       // Redirect to partner matching screen
//       router.replace("/(onboarding)/Screen133");
//     } else {
//       Alert.alert("Error", "Could not reset pairing. Please try again.");
//     }
//   };

//   if (loading) {
//     const spinAnimation = spinValue.interpolate({
//       inputRange: [0, 1],
//       outputRange: ["0deg", "360deg"],
//     });
//     return (
//       <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg} resizeMode="cover">
//         <ScreenContainer style={{ backgroundColor: 'transparent', paddingHorizontal: 0, paddingTop: 0 }}>
//           <View style={styles.centered}>
//             <Animated.Image
//               source={require("../../assets/images/onboarding/shield.png")}
//               style={[styles.loadingIcon, { transform: [{ rotate: spinAnimation }] }]}
//             />
//             <Text style={styles.loadingText} numberOfLines={1}>Your freedom is loading...</Text>
//           </View>
//         </ScreenContainer>
//       </ImageBackground>
//     );
//   }

//   // If no user data after loading, show a fallback
//   if (!user) {
//     return (
//       <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg} resizeMode="cover">
//         <ScreenContainer style={{ backgroundColor: 'transparent', paddingHorizontal: 0, paddingTop: 0 }}>
//           <View style={styles.centered}>
//             <Text style={styles.freeMind} numberOfLines={1}>WARRIOR</Text>
//             <Text style={styles.heroName} numberOfLines={1}>GUEST</Text>
//             <Text style={styles.heroSubtitle} numberOfLines={1}>Day 1 of your liberation</Text>
//             <View style={styles.sectionBox}>
//               <Text style={styles.sectionTitle} numberOfLines={1}>WELCOME TO UNBOUND</Text>
//               <Text style={styles.timeCompare} numberOfLines={2}>Your journey begins now.</Text>
//             </View>
//           </View>
//         </ScreenContainer>
//       </ImageBackground>
//     );
//   }

//   return (
//     <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg} resizeMode="cover">
//       <ScreenContainer style={{ backgroundColor: 'transparent', paddingHorizontal: 0, paddingTop: 0 }}>
//         <ScrollView
//           alwaysBounceVertical={true}
//           contentContainerStyle={styles.centered}
//           showsVerticalScrollIndicator={false}
//         >
//           <Image source={require("../../assets/images/camp-avatar.png")} style={styles.avatar} />
//           <Text style={styles.heroName} numberOfLines={1}>{user.firstName}</Text>
//           <Text style={styles.heroSubtitle} numberOfLines={1}>Day {user.streakDays} of your liberation</Text>

//           <AchievementLevel totalHoursSaved={user.totalBlockedHours} />

//           <View style={[styles.sectionBox, { alignItems: 'center' }]}>
//             <View style={[styles.rowCenter, styles.centeredRow]}>
//               <Image source={require("../../assets/images/clock.png")} style={styles.sectionIcon} />
//               <Text style={styles.sectionTitle} numberOfLines={1}>Time reclaimed this week</Text>
//             </View>
//             <Text style={styles.timeSaved} numberOfLines={1}>{formatTimeSaved(user.timeSavedThisWeek)}</Text>
//             <Text style={styles.timeCompare} numberOfLines={2}>{getTimeComparison(user.timeSavedThisWeek)}</Text>
//           </View>

//           <View style={styles.sectionBox}>
//             <View style={[styles.rowCenter, styles.centeredRow]}>
//               <Image source={require("../../assets/images/handshake.png")} style={styles.sectionIcon} />
//               <Text style={styles.sectionTitle} numberOfLines={1}>Your accountability partner</Text>
//             </View>
//             <View style={[styles.rowCenter, styles.centeredRow]}>
//               <Text style={styles.partnerHighlight} numberOfLines={1}>
//                 {partner
//                   ? `${partner.name} from ${partner.city || 'Unknown'} - Day ${partner.streakDays}`
//                   : "Your partner is setting up their profile"}
//               </Text>
//             </View>
//             {partner && <Text style={[styles.partnerStatus, styles.sectionTitle]} numberOfLines={1}>{partner.status}</Text>}
//             {partner && (
//               <Link href={`/messages/${partner.id}`} asChild>
//                 <TouchableOpacity style={styles.chatButton}>
//                   <Text style={styles.chatButtonText} numberOfLines={1}>Start Chat</Text>
//                 </TouchableOpacity>
//               </Link>
//             )}
//           </View>

//           <View style={styles.sectionBox}>
//             <Text style={styles.sectionTitle} numberOfLines={1}>COMMUNITY</Text>
//             <Text style={styles.timeCompare} numberOfLines={2}>{community.totalUsers.toLocaleString()} warriors have saved {formatTimeSaved(community.totalTimeSaved)}</Text>
//           </View>
//         </ScrollView>
//       </ScreenContainer>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   bg: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//   },
//   centered: {
//     flexGrow: 1,
//     alignItems: "center",
//     justifyContent: "flex-start",
//     paddingTop: SPACING.xxxl,
//     paddingBottom: 24,
//   },
//   freeMind: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#2C1A05",
//     fontFamily: "Vollkorn-Bold",
//     marginTop: SPACING.xl,
//     marginBottom: 8,
//     textAlign: "center",
//     width: "92%",
//   },
//   avatar: {
//     width: 180,
//     height: 180,
//     resizeMode: "contain",
//     marginBottom: 12,
//   },
//   heroName: {
//     fontSize: 36,
//     fontWeight: "bold",
//     color: "#2C1A05",
//     fontFamily: "Vollkorn-Bold",
//     marginBottom: 0,
//     textAlign: "center",
//     width: "92%",
//   },
//   heroSubtitle: {
//     fontSize: 18,
//     color: "#2C1A05",
//     fontFamily: "Vollkorn-Bold",
//     marginTop: SPACING.sm,
//     marginBottom: SPACING.md,
//     textAlign: "center",
//     width: "92%",
//   },
//   sectionBox: {
//     borderWidth: 1.5,
//     borderColor: "#E6D3A7",
//     borderRadius: 16,
//     padding: 18,
//     marginBottom: 18,
//     width: "92%",
//     alignItems: "flex-start",
//     backgroundColor: COLORS.textGold,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#2C1A05",
//     fontFamily: "Vollkorn-Bold",
//     marginBottom: 8,
//     textAlign: "center",
//     alignSelf: "center",
//   },
//   rowCenter: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 6,
//     width: "100%",
//   },
//   centeredRow: {
//     justifyContent: "center",
//   },
//   sectionIcon: {
//     width: 24,
//     height: 24,
//     marginRight: 8,
//     resizeMode: "contain",
//   },
//   timeSaved: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#2C1A05",
//     fontFamily: "Vollkorn-Bold",
//     textAlign: 'center',
//   },
//   timeCompare: {
//     fontSize: 16,
//     color: "#2C1A05",
//     fontFamily: "Vollkorn-SemiBold",
//     marginTop: 2,
//     textAlign: "center",
//     width: "100%",
//   },
//   partnerHighlight: {
//     fontSize: 18,
//     color: "#1B5E20",
//     fontFamily: "Vollkorn-Bold",
//     textDecorationLine: "underline",
//   },
//   partnerStatus: {
//     fontSize: 16,
//     color: "#2C1A05",
//     fontFamily: "Vollkorn-Bold",
//     marginTop: 2,
//     width: "100%",
//   },
//   loadingText: {
//     fontSize: 18,
//     color: "#2C1A05",
//     textAlign: "center",
//     marginTop: 16,
//     fontFamily: "Vollkorn-Bold",
//   },
//   loadingIcon: {
//     width: 60,
//     height: 60,
//     resizeMode: "contain",
//   },
//   devButton: {
//     backgroundColor: "#A52A2A",
//     padding: SPACING.md,
//     borderRadius: SPACING.sm,
//     marginTop: SPACING.lg,
//     marginBottom: SPACING.lg,
//   },
//   devButtonText: {
//     color: "white",
//     textAlign: "center",
//     fontFamily: "Vollkorn-Bold",
//   },
//   chatButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: SPACING.sm,
//     paddingHorizontal: SPACING.lg,
//     borderRadius: SPACING.sm,
//     marginTop: SPACING.md,
//     alignSelf: 'center',
//   },
//   chatButtonText: {
//     color: 'white',
//     fontFamily: 'Vollkorn-Bold',
//     fontSize: 16,
//   },
// });
