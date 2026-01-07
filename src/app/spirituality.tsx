import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';

export default function SpiritualityScreen() {
  const { colors, isDarkMode, shadows } = useAppTheme();

  // Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleStart = () => {
    if (!timerActive && !startTime) {
      const now = new Date();
      const end = new Date(now.getTime() + timeLeft * 1000);
      setStartTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setEndTime(end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    setTimerActive(!timerActive);
  };

  const handleReset = () => {
    setTimeLeft(1800);
    setStartTime(null);
    setEndTime(null);
    setTimerActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const scheduleItems = [
    { id: '1', title: 'Leitura Reflexiva', status: 'Ativa', progress: '30 min • Seg/Qua/Sex', completed: false },
    { id: '2', title: 'Oração Matinal', status: 'Concluído', progress: '10 min • Diário', completed: true },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={[styles.title, { color: colors.text }]}>Conexão Interior</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Pratique a presença e a gratidão.</Text>
      </View>

      {/* Timer Card */}
      <View style={[styles.timerCard, shadows.lg]}>
        {/* Decorative Blur Circle (Simulated) */}
        <View style={styles.blurCircle} />

        <Text style={styles.timerLabel}>LEITURA — SALMO 23</Text>

        <Text style={styles.timerDisplay}>
          {formatTime(timeLeft)}
        </Text>

        {startTime && (
          <View style={styles.timeInfoContainer}>
            <View style={styles.timeInfoItem}>
              <MaterialCommunityIcons name="clock-outline" size={12} color="rgba(255,255,255,0.8)" />
              <Text style={styles.timeInfoText}>Início: {startTime}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.timeInfoItem}>
              <Text style={[styles.timeInfoText, { color: '#DBEAFE', fontWeight: 'bold' }]}>Alarme: {endTime}</Text>
            </View>
          </View>
        )}

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            onPress={handleStart}
            activeOpacity={0.8}
            style={styles.playButton}
          >
            <MaterialCommunityIcons
              name={timerActive ? "pause" : "play"}
              size={32}
              color="#2563EB"
              style={{ marginLeft: timerActive ? 0 : 4 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleReset}
            activeOpacity={0.8}
            style={styles.resetButton}
          >
            <MaterialCommunityIcons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Schedule Section */}
      <View style={styles.scheduleSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="book-open-page-variant" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Cronograma Semanal</Text>
          </View>
          <Text style={[styles.sectionBadge, { color: colors.textSecondary }]}>3 CONCLUÍDAS</Text>
        </View>

        <View style={styles.listContainer}>
          {scheduleItems.map((item) => (
            <View
              key={item.id}
              style={[
                styles.listItem,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border
                }
              ]}
            >
              <View>
                <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{item.progress}</Text>
              </View>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name={item.completed ? "check-circle" : "check-circle-outline"}
                  size={24}
                  color={item.completed ? colors.success : colors.border}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  timerCard: {
    backgroundColor: '#0A6CF0', // Blue 500/600ish
    borderRadius: 48, // rounded-[3rem]
    padding: 32,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#3B82F6',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  blurCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  timerLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  timerDisplay: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  timeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 32,
    gap: 12,
  },
  timeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeInfoText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  resetButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(96, 165, 250, 0.3)', // blue-400/30
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleSection: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 12,
  },
});
