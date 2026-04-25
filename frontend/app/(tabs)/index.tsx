import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Good morning, AJ! 👋</Text>
            <Text style={styles.subGreeting}>Ready to learn something new today?</Text>
          </View>
          <View style={styles.starsContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.starsText}>120 Stars</Text>
          </View>
        </View>

        {/* Level Up Stats */}
        <View style={styles.levelContainer}>
          <Text style={styles.levelTitle}>Level 5 Scholar</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '60%' }]} />
          </View>
          <Text style={styles.levelSubtitle}>Keep reading to reach Level 6!</Text>
        </View>

        {/* Streak Pet / Kamustahan */}
        <View style={styles.kamustahanCard}>
          <View style={styles.kamustahanTextContainer}>
            <Text style={styles.kamustahanLabel}>Attendance & Sentiment Check-in</Text>
            <Text style={styles.kamustahanTitle}>Kamustahan</Text>
            <Text style={styles.kamustahanSub}>Let's start your day by checking in!</Text>
          </View>
          <View style={styles.petPlaceholder}>
            <Ionicons name="happy" size={50} color="#146C43" />
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Answer your assessment now!</Text>
        </TouchableOpacity>

        {/* Pendings */}
        <Text style={styles.sectionTitle}>Pendings</Text>
        <View style={styles.listCard}>
          <View style={styles.listItem}>
            <Ionicons name="document-text" size={24} color="#146C43" style={styles.listIcon} />
            <View>
              <Text style={styles.listTitle}>English Reading Comprehension</Text>
              <Text style={styles.listSub}>Due Today • English</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" style={styles.listArrow} />
          </View>
          <View style={styles.listItemBorder} />
          <View style={styles.listItem}>
            <Ionicons name="document-text" size={24} color="#146C43" style={styles.listIcon} />
            <View>
              <Text style={styles.listTitle}>Filipino: Kwento ni Juan</Text>
              <Text style={styles.listSub}>Due Tomorrow • Filipino</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" style={styles.listArrow} />
          </View>
        </View>

        {/* Completed */}
        <Text style={styles.sectionTitle}>Completed</Text>
        <View style={styles.listCard}>
          <View style={styles.listItem}>
            <Ionicons name="checkmark-circle" size={24} color="#28A745" style={styles.listIcon} />
            <View>
              <Text style={styles.listTitle}>Math Word Problems</Text>
              <Text style={styles.listSub}>Score: 90% • Level 2</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" style={styles.listArrow} />
          </View>
        </View>

        <View style={{ height: 80 }} /> {/* Padding for Floating Button */}
      </ScrollView>

      {/* Floating Type (FAB) */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="sparkles" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Cream background
  },
  scrollContent: {
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  starsText: {
    marginLeft: 6,
    fontWeight: 'bold',
    color: '#D4A017',
  },
  levelContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#146C43',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#146C43',
    borderRadius: 4,
  },
  levelSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  kamustahanCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  kamustahanTextContainer: {
    flex: 1,
  },
  kamustahanLabel: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 4,
  },
  kamustahanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 6,
  },
  kamustahanSub: {
    fontSize: 14,
    color: '#4CAF50',
  },
  petPlaceholder: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 35,
    marginLeft: 15,
  },
  actionButton: {
    backgroundColor: '#146C43',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#146C43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  listCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  listItemBorder: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 5,
  },
  listIcon: {
    marginRight: 15,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  listArrow: {
    marginLeft: 'auto',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F2A900', // vibrant yellow/orange for the "Floating type"
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F2A900',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});
