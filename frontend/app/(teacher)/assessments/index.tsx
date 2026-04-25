import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AssessmentsScreen() {
  const router = useRouter();

  const activeAssessments = [
    { id: 1, title: 'The Brave Cockatoo', class: 'Grade 3-A Science', due: 'Today, 3:00 PM', status: 'Active' },
    { id: 2, title: 'Ang Alamat ng Pinya', class: 'Grade 3-B Filipino', due: 'Tomorrow', status: 'Scheduled' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assessments</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Manage Assessments</Text>
        
        {activeAssessments.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text" size={24} color="#146C43" />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.class}</Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.dueText}>Due: {item.due}</Text>
              <View style={[styles.statusBadge, item.status === 'Active' ? styles.badgeActive : styles.badgeScheduled]}>
                <Text style={item.status === 'Active' ? styles.badgeTextActive : styles.badgeTextScheduled}>{item.status}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} /> {/* Padding for FAB */}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/(teacher)/assessments/create')}
      >
        <Ionicons name="add" size={30} color="#FFF" />
        <Text style={styles.fabText}>Create New</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: { padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#146C43' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#EEE', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardInfo: { marginLeft: 15, flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSub: { fontSize: 14, color: '#666', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12 },
  dueText: { fontSize: 12, color: '#666', fontWeight: '500' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeActive: { backgroundColor: '#E8F5E9' },
  badgeScheduled: { backgroundColor: '#FFF8E1' },
  badgeTextActive: { color: '#2E7D32', fontSize: 12, fontWeight: 'bold' },
  badgeTextScheduled: { color: '#F57F17', fontSize: 12, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#146C43', flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  fabText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 5 }
});
