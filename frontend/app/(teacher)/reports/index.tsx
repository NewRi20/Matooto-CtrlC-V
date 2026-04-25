import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ReportsDashboardScreen() {
  const router = useRouter();

  const handleSelectReport = (title: string, icon: string) => {
    router.push({
      pathname: '/(teacher)/reports/generate',
      params: { title, icon }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Automated Reports</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Category 1 */}
        <Text style={styles.sectionTitle}>Student & Parent Communications</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.card} onPress={() => handleSelectReport('Parent Consultation Report', 'people')}>
            <Ionicons name="people" size={32} color="#146C43" style={styles.icon} />
            <Text style={styles.cardTitle}>Parent Consultation</Text>
            <Text style={styles.cardSub}>Reading Comprehension</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => handleSelectReport('Student Records Export', 'folder-open')}>
            <Ionicons name="folder-open" size={32} color="#146C43" style={styles.icon} />
            <Text style={styles.cardTitle}>Student Records</Text>
            <Text style={styles.cardSub}>Grades & Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => handleSelectReport('Achievement Certificate', 'ribbon')}>
            <Ionicons name="ribbon" size={32} color="#146C43" style={styles.icon} />
            <Text style={styles.cardTitle}>Achievement Cert</Text>
            <Text style={styles.cardSub}>Automated Award</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => handleSelectReport('Incident Report Form', 'warning')}>
            <Ionicons name="warning" size={32} color="#D32F2F" style={styles.icon} />
            <Text style={styles.cardTitle}>Incident Report</Text>
            <Text style={styles.cardSub}>Standard Form</Text>
          </TouchableOpacity>
        </View>

        {/* Category 2 */}
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Administrative & Class Logs</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.card} onPress={() => handleSelectReport('Lesson Plan Report', 'book')}>
            <Ionicons name="book" size={32} color="#146C43" style={styles.icon} />
            <Text style={styles.cardTitle}>Lesson Plan</Text>
            <Text style={styles.cardSub}>Weekly Log Format</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => handleSelectReport('Advisory Class Report', 'stats-chart')}>
            <Ionicons name="stats-chart" size={32} color="#146C43" style={styles.icon} />
            <Text style={styles.cardTitle}>Advisory Report</Text>
            <Text style={styles.cardSub}>Class Overview</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => handleSelectReport('Class Record', 'list')}>
            <Ionicons name="list" size={32} color="#146C43" style={styles.icon} />
            <Text style={styles.cardTitle}>Class Record</Text>
            <Text style={styles.cardSub}>Official Log</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => handleSelectReport('Announcement Letter', 'megaphone')}>
            <Ionicons name="megaphone" size={32} color="#146C43" style={styles.icon} />
            <Text style={styles.cardTitle}>Announcement</Text>
            <Text style={styles.cardSub}>School Letter</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: { padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#146C43' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  card: { width: '48%', backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#EEE', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, alignItems: 'center', textAlign: 'center' },
  icon: { marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 4 },
  cardSub: { fontSize: 10, color: '#666', textAlign: 'center' }
});
