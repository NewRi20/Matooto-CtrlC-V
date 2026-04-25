import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AssessmentsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Pending', 'Completed'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ASSESSMENTS</Text>
        <Ionicons name="search" size={24} color="#146C43" />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* PENDING SECTION */}
        {(activeTab === 'All' || activeTab === 'Pending') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PENDING</Text>
            
            {/* Card 1 */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="clipboard" size={40} color="#146C43" style={styles.cardIcon} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>The Brave Cockatoo</Text>
                  <View style={styles.tagsContainer}>
                    <Text style={styles.tagLang}>English</Text>
                    <Text style={styles.tagDiffMedium}>Medium</Text>
                    <View style={styles.timeContainer}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.timeText}>15 min</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.dueText}>Due: Today, 3:00 PM</Text>
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={() => router.push('/assessment/read')}
                >
                  <Text style={styles.startButtonText}>Start Assessment</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Card 2 */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="clipboard" size={40} color="#146C43" style={styles.cardIcon} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>Ocean Mystery</Text>
                  <View style={styles.tagsContainer}>
                    <Text style={styles.tagLang}>Tagalog</Text>
                    <Text style={styles.tagDiffEasy}>Easy</Text>
                    <View style={styles.timeContainer}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.timeText}>10 min</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.dueTextNormal}>Due: Tomorrow</Text>
                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start Assessment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* COMPLETED SECTION */}
        {(activeTab === 'All' || activeTab === 'Completed') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>COMPLETED</Text>
            
            {/* Card 3 */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="clipboard" size={40} color="#146C43" style={styles.cardIcon} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>Forest Adventure</Text>
                  <View style={styles.tagsContainer}>
                    <Text style={styles.tagScoreYellow}>75%</Text>
                    <Text style={styles.tagLang}>English</Text>
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#146C43" />
                      <Text style={styles.completedText}>Completed</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.cardFooterCompleted}>
                <TouchableOpacity style={styles.viewResultsButton}>
                  <Text style={styles.viewResultsText}>View Results</Text>
                  <Ionicons name="chevron-forward" size={16} color="#146C43" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Card 4 */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="clipboard" size={40} color="#146C43" style={styles.cardIcon} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>The River Journey</Text>
                  <View style={styles.tagsContainer}>
                    <Text style={styles.tagScoreGreen}>90%</Text>
                    <Text style={styles.tagLang}>Tagalog</Text>
                    <View style={styles.completedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#146C43" />
                      <Text style={styles.completedText}>Completed</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.cardFooterCompleted}>
                <TouchableOpacity style={styles.viewResultsButton}>
                  <Text style={styles.viewResultsText}>View Results</Text>
                  <Ionicons name="chevron-forward" size={16} color="#146C43" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Cream background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FAF9F6',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#146C43', // Forest green
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAF9F6',
    marginHorizontal: 5,
  },
  tabButtonActive: {
    backgroundColor: '#146C43',
    borderColor: '#146C43',
  },
  tabText: {
    fontWeight: '600',
    color: '#333',
  },
  tabTextActive: {
    color: '#FFF',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#146C43',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  cardIcon: {
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagLang: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    color: '#333',
    overflow: 'hidden',
  },
  tagDiffMedium: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  tagDiffEasy: {
    backgroundColor: '#28A745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  cardFooterCompleted: {
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  dueText: {
    color: '#D32F2F', // Red for today
    fontWeight: 'bold',
    fontSize: 14,
  },
  dueTextNormal: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  startButton: {
    backgroundColor: '#146C43',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  tagScoreYellow: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  tagScoreGreen: {
    backgroundColor: '#28A745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#146C43',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  completedText: {
    fontSize: 12,
    color: '#146C43',
    marginLeft: 4,
    fontWeight: '500',
  },
  viewResultsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewResultsText: {
    color: '#146C43',
    fontWeight: 'bold',
    marginRight: 4,
  },
});
