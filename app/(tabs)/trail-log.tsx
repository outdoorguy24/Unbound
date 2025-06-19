import { SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { getTrailLog } from "@/lib/trailLog";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Text, View } from "react-native";

const MILESTONES = [10, 50, 100, 500, 1000]; // in days

function calcTimeSavedDays(logs: { action: string; created_at: string }[]) {
  let totalMs = 0;
  let lastEnabled: Date | null = null;
  logs.forEach((log) => {
    if (log.action === "blocking_enabled") {
      lastEnabled = new Date(log.created_at);
    } else if (log.action === "blocking_disabled" && lastEnabled !== null) {
      const disabledAt = new Date(log.created_at);
      totalMs += disabledAt.getTime() - (lastEnabled as Date).getTime();
      lastEnabled = null;
    }
  });
  if (lastEnabled !== null) {
    totalMs += Date.now() - (lastEnabled as Date).getTime();
  }
  return totalMs / (1000 * 60 * 60 * 24); // convert ms to days
}

function calcTotalBlocks(logs: any[]) {
  return logs.filter((log) => log.action === "blocked_attempt").length;
}

function calcStreakDays(logs: any[]) {
  const days = new Set(
    logs
      .filter((log) => log.action === "blocked_attempt" || log.action === "streak_day")
      .map((log) => new Date(log.created_at).toISOString().slice(0, 10))
  );
  const sorted = Array.from(days).sort((a, b) => b.localeCompare(a));
  if (sorted.length === 0) return 0;
  let streak = 0;
  let d = new Date();
  for (let i = 0; i < sorted.length; i++) {
    const dayStr = d.toISOString().slice(0, 10);
    if (sorted.includes(dayStr)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function getNextMilestone(currentDays: number) {
  for (let m of MILESTONES) {
    if (currentDays < m) return m;
  }
  return null;
}

export default function TrailLogScreen() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      if (!user?.id) return;
      setLoading(true);
      const data = await getTrailLog(user.id, { limit: 500 });
      setLogs(data || []);
      setLoading(false);
    }
    fetchLogs();
  }, [user]);

  if (loading) {
    return (
      <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg}>
        <ActivityIndicator size="large" color="#4B3415" style={{ marginTop: 40 }} />
      </ImageBackground>
    );
  }

  const timeSavedDays = calcTimeSavedDays(logs);
  const totalBlocks = calcTotalBlocks(logs);
  const streakDays = calcStreakDays(logs);
  const nextMilestone = getNextMilestone(timeSavedDays);
  const milestoneHours = nextMilestone ? nextMilestone * 24 : 100;

  return (
    <ImageBackground source={require("../../assets/images/parchment-bg.png")} style={styles.bg}>
      <View style={styles.container}>
        <Text style={styles.header}>Trail Log</Text>
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>
            The edge... there is no honest way to explain it because the only thing that matters.
          </Text>
          <Text style={styles.quoteAuthor}>- Hunter S. Thompson</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{(timeSavedDays * 24 * 60).toFixed(0)}m</Text>
            <Text style={styles.statLabel}>TIME SAVED</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{Math.floor(timeSavedDays)}</Text>
            <Text style={styles.statLabel}>DAYS SAVED</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalBlocks}</Text>
            <Text style={styles.statLabel}>TOTAL BLOCKS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{streakDays}</Text>
            <Text style={styles.statLabel}>Streak Days</Text>
          </View>
        </View>
        <View style={styles.milestoneBox}>
          <Image source={require("../../assets/images/flag.png")} style={styles.milestoneIcon} />
          <Text style={styles.milestoneValue}>{milestoneHours} Hours</Text>
          <Text style={styles.milestoneSub}>Time Saved Goal</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    margin: SPACING.md,
    padding: SPACING.md,
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    marginTop: SPACING.xl,
    marginBottom: 0,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: SPACING.md,
    marginBottom: -1 * SPACING.xxl,
    width: "100%",
    height: undefined,
  },
  statBox: {
    width: "47%",
    aspectRatio: 1.1,
    backgroundColor: "#4B3415",
    borderRadius: 22,
    marginBottom: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  statValue: {
    fontSize: 32,
    fontFamily: "Arial",
    color: "#F9E7B0",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 16,
    fontFamily: "Vollkorn-SemiBold",
    color: "#F9E7B0",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    textAlign: "center",
  },
  milestoneBox: {
    backgroundColor: "#4B3415",
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 32,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    width: "100%",
  },
  milestoneIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  milestoneValue: {
    color: "#F9E7B0",
    fontSize: 30,
    fontFamily: "Arial",
    fontWeight: "bold",
    marginBottom: SPACING.sm,
  },
  milestoneSub: {
    color: "#F9E7B0",
    fontSize: 18,
    fontFamily: "Vollkorn-SemiBold",
    letterSpacing: 1.1,
  },
  quoteBox: {
    backgroundColor: "#F9E7B0",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E6D3A7",
    padding: SPACING.md,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    width: "100%",
    alignItems: "center",
  },
  quoteText: {
    fontSize: 20,
    fontFamily: "Vollkorn-Bold",
    color: "#2C1A05",
    textAlign: "center",
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 16,
    fontFamily: "Vollkorn-SemiBold",
    color: "#2C1A05",
    textAlign: "right",
    alignSelf: "flex-end",
    marginTop: SPACING.sm,
  },
});
