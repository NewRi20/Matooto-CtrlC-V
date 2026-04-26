import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import assessmentData from '@/constants/assessmentresults.json';

export default function ReportsScreen() {
  const router = useRouter();

  const getProgressColor = (first: number, second: number) => {
    const improvement = second - first;
    if (improvement >= 3) return '#4CAF50'; // Green - good improvement
    if (improvement >= 1) return '#FFC107'; // Yellow - some improvement
    return '#F44336'; // Red - no improvement
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parent Consultation Report</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Student Assessment Progress</Text>
        <Text style={styles.subtitle}>First Assessment → Second Assessment</Text>

        {assessmentData.reports.map((report, index) => (
          <View key={index} style={styles.reportCard}>
            <View style={styles.cardHeader}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{report.student_name}</Text>
                <Text style={styles.subject}>{report.subject}</Text>
              </View>
              <View style={[styles.progressIndicator, { backgroundColor: getProgressColor(report.first_assessment.score_out_of_10, report.second_assessment.score_out_of_10) }]}>
                <Ionicons name="trending-up" size={20} color="#FFF" />
              </View>
            </View>

            <View style={styles.assessmentRow}>
              <View style={styles.assessmentBox}>
                <Text style={styles.assessmentLabel}>1st Assessment</Text>
                <Text style={styles.score}>{report.first_assessment.score_out_of_10}/10</Text>
                <Text style={styles.rating}>{report.first_assessment.rating}</Text>
              </View>

              <View style={styles.arrowContainer}>
                <Ionicons name="arrow-forward" size={24} color="#146C43" />
              </View>

              <View style={styles.assessmentBox}>
                <Text style={styles.assessmentLabel}>2nd Assessment</Text>
                <Text style={styles.score}>{report.second_assessment.score_out_of_10}/10</Text>
                <Text style={styles.rating}>{report.second_assessment.rating}</Text>
              </View>
            </View>

            <View style={styles.improvementBar}>
              <View style={[styles.improvementFill, { width: `${(report.second_assessment.score_out_of_10 / 10) * 100}%`, backgroundColor: getProgressColor(report.first_assessment.score_out_of_10, report.second_assessment.score_out_of_10) }]} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    gap: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#146C43',
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  reportCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subject: {
    fontSize: 13,
    color: '#666',
  },
  progressIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assessmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  assessmentBox: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  assessmentLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#146C43',
    marginBottom: 2,
  },
  rating: {
    fontSize: 12,
    color: '#888',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  improvementBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  improvementFill: {
    height: '100%',
    borderRadius: 3,
  },
});
