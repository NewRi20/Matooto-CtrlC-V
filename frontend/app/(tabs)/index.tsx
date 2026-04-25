import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

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
        </View>

        {/* Learner's Pet & Progress */}
        <View style={styles.petCard}>
          <View style={styles.petTextContainer}>
            <Text style={styles.petLabel}>Your Companion</Text>
            <Text style={styles.petTitle}>Level 5 Pet</Text>

            <View style={styles.petProgressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '60%' }]} />
              </View>
              <Text style={styles.petSub}>Keep reading to reach Level 6!</Text>
            </View>
          </View>
          <View style={styles.petImageContainer}>
            <Image source={require('@/assets/images/pet_5.svg')} style={{ width: 100, height: 100 }} contentFit="contain" />
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

        <View style={{ height: 20 }} /> {/* Padding */}
      </ScrollView>
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
  progressBarBg: {
    height: 8,
    backgroundColor: '#C8E6C9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#146C43',
    borderRadius: 4,
  },
  petProgressContainer: {
    marginTop: 10,
    paddingRight: 10,
  },
  petCard: {
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
  petTextContainer: {
    flex: 1,
  },
  petLabel: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 4,
  },
  petTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 6,
  },
  petSub: {
    fontSize: 14,
    color: '#4CAF50',
  },
  petImageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
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
});
