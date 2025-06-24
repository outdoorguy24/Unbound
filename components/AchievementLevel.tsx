import { COLORS } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AchievementLevelProps {
  totalHoursSaved: number;
}

const LEVELS = [
  { name: "Rookie", min: 0, max: 49 },
  { name: "Soldier", min: 50, max: 149 },
  { name: "Warrior", min: 150, max: 249 },
  { name: "Commander", min: 250, max: 349 },
  { name: "Legend", min: 350, max: Infinity },
];

const SEGMENT_COUNT = LEVELS.length;
const SEGMENT_GAP = 8;

export default function AchievementLevel({ totalHoursSaved }: AchievementLevelProps) {
  // Find current level
  const currentLevelIdx = LEVELS.findIndex(
    (level) => totalHoursSaved >= level.min && totalHoursSaved <= level.max
  );
  const currentLevel = LEVELS[currentLevelIdx] || LEVELS[0];
  const nextLevel = LEVELS[currentLevelIdx + 1];

  // Progress within current level
  let progress = 0;
  if (nextLevel) {
    const range = currentLevel.max - currentLevel.min + 1;
    progress = (totalHoursSaved - currentLevel.min) / range;
    progress = Math.max(0, Math.min(progress, 1));
  } else {
    progress = 1;
  }

  // Calculate hours to next level
  const hoursToNext = nextLevel ? nextLevel.min - totalHoursSaved : 0;

  return (
    <View style={styles.container}>
      {/* Tracker */}
      <View style={styles.trackerContainer}>
        {/* Tracker columns: name, pill, arrow all in one column per level */}
        <View style={styles.trackerRow}>
          {LEVELS.map((level, idx) => (
            <View key={level.name} style={styles.trackerStep}>
              <Text
                style={[
                  styles.levelName,
                  idx === currentLevelIdx && styles.levelNameActive,
                ]}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                {level.name}
              </Text>
              <View style={styles.segmentBox}> 
                {/* Current pill is solid green, all others are white */}
                {idx === currentLevelIdx && <View style={[styles.segmentFill, { backgroundColor: COLORS.success, width: '100%' }]} />}
                {idx !== currentLevelIdx && <View style={[styles.segmentFill, { backgroundColor: '#fff', width: '100%' }]} />}
                <View style={styles.segmentOutline} />
              </View>
              <View style={{ height: 8 }} />
              {idx === currentLevelIdx && <View style={styles.arrow} />}
            </View>
          ))}
        </View>
        {/* Copy below */}
        {nextLevel && (
          <Text style={styles.nextLevelText}>
            {hoursToNext} hour{hoursToNext === 1 ? '' : 's'} to {nextLevel.name}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.textGold,
    borderWidth: 1.5,
    borderColor: '#E6D3A7',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    width: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  trackerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  trackerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 2,
    gap: SEGMENT_GAP,
  },
  trackerStep: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0, // allow shrinking for nowrap
  },
  levelName: {
    fontSize: 11,
    color: '#2C1A05',
    fontFamily: 'Vollkorn-Bold',
    textAlign: 'center',
    includeFontPadding: false,
    paddingHorizontal: 0,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  levelNameActive: {
    textDecorationLine: 'underline',
  },
  segmentBox: {
    height: 18,
    backgroundColor: '#E6D3A7',
    borderRadius: 9,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minWidth: 0,
  },
  segmentFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 8,
    height: '100%',
    zIndex: 1,
  },
  segmentOutline: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1.5,
    borderColor: '#BCA77B',
    borderRadius: 8,
    zIndex: 2,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.success,
    marginTop: 0,
  },
  nextLevelText: {
    fontSize: 14,
    color: '#2C1A05',
    fontFamily: 'Vollkorn-SemiBold',
    marginTop: 6,
    textAlign: 'center',
  },
}); 