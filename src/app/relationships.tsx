import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/theme';
import { Compromisso, ContactSuggestion } from '@/models';
import { relationshipService } from '@/services/RelationshipService';
import { CompromissoFormModal } from '@/components/relationships/CompromissoFormModal';
import { SuggestedContactModal } from '@/components/relationships/SuggestedContactModal';

export default function RelationshipScreen() {
  const { colors, isDarkMode, shadows } = useAppTheme();

  const [events, setEvents] = useState<Compromisso[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<{ d: string; day: string; fullDate: string; active: boolean }[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCompromisso, setSelectedCompromisso] = useState<Compromisso | null>(null);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [suggestedContact, setSuggestedContact] = useState<ContactSuggestion | null>(null);

  const fetchCompromissos = useCallback(async () => {
    try {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const data = await relationshipService.getCompromissosByDate(dateStr);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching compromissos:', error);
    }
  }, [selectedDate]);

  const generateCalendar = useCallback(() => {
    const days = [];
    const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    // Generate 7 days starting from 3 days before selectedDate
    for (let i = -2; i <= 4; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dayRaw = String(d.getDate()).padStart(2, '0');
      const fullDate = `${year}-${month}-${dayRaw}`;

      const yearSelected = selectedDate.getFullYear();
      const monthSelected = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const daySelected = String(selectedDate.getDate()).padStart(2, '0');
      const selectedDateStr = `${yearSelected}-${monthSelected}-${daySelected}`;

      days.push({
        d: d.getDate().toString(),
        day: weekDays[d.getDay()],
        fullDate,
        active: fullDate === selectedDateStr
      });
    }
    setCalendarDays(days);
  }, [selectedDate]);

  useEffect(() => {
    generateCalendar();
    fetchCompromissos();
  }, [selectedDate, fetchCompromissos, generateCalendar]);

  const handleDelete = (id: string) => {
    Alert.alert('Excluir Encontro', 'Deseja realmente excluir este encontro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await relationshipService.deleteCompromisso(id);
          fetchCompromissos();
        }
      }
    ]);
  };

  const handleSuggestContact = async () => {
    try {
      const contact = await relationshipService.getRandomContact();
      if (contact) {
        setSuggestedContact(contact);
        setIsContactModalVisible(true);
      } else {
        Alert.alert('Nenhum contato encontrado', 'Não conseguimos encontrar contatos com números de telefone na sua agenda.');
      }
    } catch (error) {
      console.error('Error suggesting contact:', error);
      Alert.alert('Permissão Necessária', 'Precisamos de permissão para acessar seus contatos para esta funcionalidade.');
    }
  };

  const getEventIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('café') || t.includes('cafe')) return 'coffee';
    if (t.includes('jantar') || t.includes('almoço') || t.includes('comida')) return 'silverware-fork-knife';
    if (t.includes('reunião') || t.includes('trampo') || t.includes('trabalho')) return 'briefcase';
    if (t.includes('presente') || t.includes('aniversário')) return 'gift';
    if (t.includes('❤️') || t.includes('amor') || t.includes('romântico')) return 'heart';
    return 'calendar-check';
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
                date.active && { backgroundColor: colors.primary }
              ]}
              onPress={() => {
                const [year, month, day] = date.fullDate.split('-').map(Number);
                setSelectedDate(new Date(year, month - 1, day));
              }}
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
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Encontros do Dia</Text>
            </View>
            <TouchableOpacity onPress={() => { setSelectedCompromisso(null); setIsModalVisible(true); }}>
              <View style={[styles.addBtnSmall, { backgroundColor: colors.primary }]}>
                <MaterialCommunityIcons name="plus" size={16} color="white" />
                <Text style={styles.addBtnSmallText}>NOVO</Text>
              </View>
            </TouchableOpacity>
          </View>

          {events.length > 0 ? (
            events.map((ev) => (
              <TouchableOpacity
                key={ev.id}
                onLongPress={() => handleDelete(ev.id)}
                onPress={() => {
                  setSelectedCompromisso(ev);
                  setIsModalVisible(true);
                }}
              >
                <View style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={[styles.eventIconBox, { backgroundColor: isDarkMode ? colors.gray800 : colors.primary + '10' }]}>
                    <MaterialCommunityIcons name={getEventIcon(ev.titulo) as any} size={24} color={colors.primary} />
                  </View>
                  <View style={styles.eventInfo}>
                    <View style={styles.eventHeader}>
                      <Text style={[styles.eventTitle, { color: colors.text }]}>{ev.titulo}</Text>
                      <Text style={[styles.eventTime, { color: colors.textSecondary }]}>
                        {ev.is_all_day ? 'Dia Todo' : new Date(ev.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                    <Text style={[styles.eventSubtitle, { color: colors.textSecondary }]}>
                      {ev.com_quem || 'Alguém especial'}
                    </Text>
                    {ev.preparacao && (
                      <View style={styles.noteBox}>
                        <MaterialCommunityIcons name="notebook-outline" size={14} color={colors.textSecondary} />
                        <Text style={[styles.noteText, { color: colors.textSecondary }]} numberOfLines={1}>
                          {ev.preparacao}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <MaterialCommunityIcons name="calendar-blank" size={48} color={colors.textSecondary + '40'} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum encontro este dia.</Text>
            </View>
          )}
        </View>

        {/* Quick Action Banner */}
        <View style={[styles.banner, shadows.md, { backgroundColor: colors.primary }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Crie memórias</Text>
            <Text style={styles.bannerDesc}>Mande uma mensagem para alguém que você não fala há algum tempo.</Text>
            <TouchableOpacity style={styles.bannerButton} onPress={handleSuggestContact}>
              <Text style={[styles.bannerButtonText, { color: colors.primary }]}>Sugerir contato</Text>
            </TouchableOpacity>
          </View>
          <MaterialCommunityIcons name="chat-processing-outline" size={64} color="rgba(255,255,255,0.2)" />
        </View>

      </ScrollView>

      <CompromissoFormModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSaveSuccess={fetchCompromissos}
        compromissoToEdit={selectedCompromisso}
      />

      <SuggestedContactModal
        visible={isContactModalVisible}
        onClose={() => setIsContactModalVisible(false)}
        contact={suggestedContact}
        onSuggestAnother={handleSuggestContact}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 120,
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
    padding: 12,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 32,
  },
  calendarItem: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
    width: 48,
    gap: 4,
  },
  calendarDay: {
    fontSize: 12,
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
  addBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  addBtnSmallText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
    marginBottom: 12,
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
    gap: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  eventSubtitle: {
    fontSize: 14,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  noteText: {
    fontSize: 12,
    fontStyle: 'italic',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  },
  banner: {
    padding: 24,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
    fontSize: 12,
  },
});
