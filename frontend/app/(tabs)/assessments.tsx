import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '@/service/firebaseConfig';
import { getClassesByStudent } from '@/service/classes.repository';
import { getAssessmentsByClass, AssessmentData } from '@/service/assessments.repository';
import { doc, getDoc } from 'firebase/firestore';

interface AssessmentWithClassInfo extends AssessmentData {
  className?: string;
  subject?: string;
}

export default function AssessmentsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [assessments, setAssessments] = useState<AssessmentWithClassInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = ['All', 'Pending', 'Completed'];

  useEffect(() => {
    fetchStudentAssessments();
  }, []);

  const fetchClassInfo = async (classId: any) => {
    try {
      if (!classId) return {};

      // If classId is a DocumentReference, get its ID
      const id = typeof classId === 'string' ? classId : classId.id;
      const classDoc = await getDoc(doc(db, 'classes', id));

      if (classDoc.exists()) {
        const data = classDoc.data();
        return {
          className: data.className || 'Unknown Class',
          subject: data.subject || 'Unknown Subject',
        };
      }
      return {};
    } catch (err) {
      console.error('Error fetching class info:', err);
      return {};
    }
  };

  const fetchStudentAssessments = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError('User not logged in');
        return;
      }

      console.log('Fetching classes for student:', currentUser.uid);

      // Get all classes the student is enrolled in
      const studentClasses = await getClassesByStudent(currentUser.uid);
      console.log('Student classes:', studentClasses);

      // Fetch assessments for all classes
      const allAssessments: AssessmentWithClassInfo[] = [];
      for (const classItem of studentClasses) {
        if (classItem.id) {
          const classAssessments = await getAssessmentsByClass(classItem.id);

          // Enrich assessments with class info
          for (const assessment of classAssessments) {
            const classInfo = await fetchClassInfo(assessment.classId);
            allAssessments.push({
              ...assessment,
              ...classInfo,
            });
          }
        }
      }

      console.log('All assessments with class info:', allAssessments);
      setAssessments(allAssessments);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      setError('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const formatDueDate = (dueDate: any) => {
    if (!dueDate) return 'No due date';
    try {
      const date = dueDate.toDate ? dueDate.toDate() : new Date(dueDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const isToday = date.toDateString() === today.toDateString();
      const isTomorrow = date.toDateString() === tomorrow.toDateString();

      if (isToday) {
        return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (isTomorrow) {
        return 'Tomorrow';
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {
      return 'Invalid date';
    }
  };

  const isPending = (scheduledFor: any) => {
    try {
      const now = new Date();
      const scheduledDate = scheduledFor?.toDate ? scheduledFor.toDate() : new Date(scheduledFor);
      return scheduledDate <= now;
    } catch {
      return false;
    }
  };

  const pendingAssessments = assessments.filter(a => isPending(a.scheduledFor));
  const completedAssessments = assessments.filter(a => !isPending(a.scheduledFor));

  const displayedAssessments = () => {
    if (activeTab === 'Pending') return pendingAssessments;
    if (activeTab === 'Completed') return completedAssessments;
    return assessments;
  };

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

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#146C43" />
          <Text style={styles.loadingText}>Loading assessments...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={40} color="#D32F2F" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchStudentAssessments}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && displayedAssessments().length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="layers-outline" size={40} color="#888" />
          <Text style={styles.emptyText}>No assessments yet</Text>
        </View>
      )}

      {!loading && !error && displayedAssessments().length > 0 && (
        <ScrollView contentContainerStyle={styles.content}>
          {displayedAssessments().map((assessment) => (
            <View key={assessment.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="clipboard" size={40} color="#146C43" style={styles.cardIcon} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{assessment.title}</Text>
                  <View style={styles.tagsContainer}>
                    <Text style={styles.tagClass}>{assessment.className}</Text>
                    <Text style={styles.tagSubject}>{assessment.subject}</Text>
                    <View style={styles.timeContainer}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.timeText}>{assessment.timeLimitMinutes} min</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.dueText}>Due: {formatDueDate(assessment.dueDate)}</Text>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() =>
                    router.push({
                      pathname: '/assessment/read',
                      params: {
                        assessmentId: assessment.id,
                        assessmentTitle: assessment.title,
                        timeLimitMinutes: assessment.timeLimitMinutes,
                        story: assessment.english_version?.story || '',
                        questionsJson: JSON.stringify(assessment.english_version?.questions || []),
                      },
                    })
                  }
                >
                  <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
    paddingBottom: 40,
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
  tagClass: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
    overflow: 'hidden',
  },
  tagSubject: {
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    color: '#7B1FA2',
    fontWeight: '600',
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
  dueText: {
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
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#146C43',
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
  },
});
