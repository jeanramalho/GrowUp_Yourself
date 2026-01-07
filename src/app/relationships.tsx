import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';

export default function RelationshipScreen() {
  const { colors, isDarkMode, shadows } = useAppTheme();

  const events = [
    { icon: 'coffee', title: 'Café com Mentoria', person: 'André S.', time: 'Amanhã, 10:00', type: 'Semanal', color: colors.blue500 },
    { icon: 'heart', title: 'Jantar Romântico', person: 'Luiza', time: 'Sexta, 20:00', type: 'Mensal', color: '#EF4444' }, // Red for heart
    { icon: 'gift', title: 'Aniversário', person: 'Maria Eduarda', time: '24 Out', type: 'Anual', color: '#F59E0B' },
  ];

  const calendarDays = [
    { d: '22', day: 'D' },
    { d: '23', day: 'S' },
    { d: '24', day: 'T', active: true },
    { d: '25', day: 'Q' },
    { d: '26', day: 'Q' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Vínculos & Convivência</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Fortaleça suas conexões humanas.</Text>
      </View>

      {/* Calendar Strip */}
      <View style={[styles.calendarStrip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {calendarDays.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.calendarItem,
              date.active && styles.calendarItemActive
            ]}
          >
            <Text style={[
              styles.calendarDay,
              { color: date.active ? 'white' : colors.textSecondary }
            ]}>{date.day}</Text>
            <Text style={[
              styles.calendarDate,
              { color: date.active ? 'white' : colors.text, fontWeight: date.active ? 'bold' : 'normal' }
            ]}>{date.d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="calendar-month-outline" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Próximos Encontros</Text>
          </View>
          <Text style={[styles.viewAllBadge, { color: colors.primary }]}>VER TODOS</Text>
        </View>

        {events.map((ev, i) => (
          <View key={i} style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.eventIconBox, { backgroundColor: isDarkMode ? colors.gray800 : colors.blue50 }]}>
              {/* @ts-ignore icon name */}
              <MaterialCommunityIcons name={ev.icon} size={24} color={ev.icon === 'heart' ? '#EF4444' : colors.primary} />
            </View>
            <View style={styles.eventInfo}>
              <View style={styles.eventHeader}>
                <Text style={[styles.eventTitle, { color: colors.text }]}>{ev.title}</Text>
                <View style={[styles.eventTypeBadge, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                  <Text style={[styles.eventTypeText, { color: colors.primary }]}>{ev.type}</Text>
                </View>
              </View>
              <Text style={[styles.eventSubtitle, { color: colors.textSecondary }]}>{ev.person} • {ev.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Quick Action Banner */}
      <View style={[styles.banner, shadows.md]}>
        <Text style={styles.bannerTitle}>Crie memórias</Text>
        <Text style={styles.bannerDesc}>Mande uma mensagem para alguém que você não fala há algum tempo.</Text>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>Sugerir contato</Text>
        </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
  },
  calendarStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 32,
  },
  calendarItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    width: 44,
    gap: 4,
  },
  calendarItemActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  calendarDay: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  calendarDate: {
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
  },
  eventIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventInfo: {
    flex: 1,
    gap: 4,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  eventTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  eventSubtitle: {
    fontSize: 12,
  },
  banner: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#60A5FA', // fallback if gradient not available, mimicking from-blue-300 to-blue-500
    // To approximate gradient: Just blue.
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  bannerDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  bannerButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#3B82F6',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
