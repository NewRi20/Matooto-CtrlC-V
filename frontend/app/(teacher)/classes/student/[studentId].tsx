import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getClassesByStudent, type ClassData } from '@/service/classes.repository';
import { getUserProfile } from '@/service/auth.service';

export default function StudentProfileScreen() {
  const { studentId } = useLocalSearchParams();
  const router = useRouter();
  const studentIdValue = useMemo(() => (Array.isArray(studentId) ? studentId[0] : studentId), [studentId]);
  const [studentName, setStudentName] = useState('Student');
  const [studentEmail, setStudentEmail] = useState<string | null>(null);
  const [studentRole, setStudentRole] = useState('');
  const [studentOnboarding, setStudentOnboarding] = useState(false);
  const [studentClasses, setStudentClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      if (!studentIdValue) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile(studentIdValue);
        setStudentName(profile.fullName || `Student ${studentIdValue}`);
        setStudentEmail(profile.email ?? null);
        setStudentRole(profile.role ?? '');
        setStudentOnboarding(Boolean(profile.onboarding));
        const enrolledClasses = await getClassesByStudent(studentIdValue);
        setStudentClasses(enrolledClasses);
      } catch (error) {
        Alert.alert('Unable to load student', 'Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void loadStudent();
  }, [studentIdValue]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#146C43" />
          <Text style={styles.centerStateText}>Loading student profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Profile</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <Ionicons name="person-circle" size={80} color="#146C43" />
          <Text style={styles.studentName}>{studentName}</Text>
          <Text style={styles.studentDetails}>{studentEmail ?? 'No email saved'}</Text>
          <Text style={styles.studentDetails}>{studentRole || 'Role not set'} • {studentOnboarding ? 'Onboarded' : 'Pending onboarding'}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>73%</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Assessments</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Enrolled Classes</Text>
        
        {studentClasses.map((item) => (
          <View key={item.id} style={styles.assessmentCard}>
            <View style={styles.assessmentHeader}>
              <Text style={styles.assessmentTitle}>{item.className}</Text>
              <Text style={styles.assessmentDate}>Grade {item.gradeLevel}</Text>
            </View>
            
            <View style={styles.tagsContainer}>
              <Text style={styles.tagLang}>{item.subject}</Text>
              <Text style={styles.tagScoreHigh}>Teacher linked</Text>
            </View>
            
            <View style={styles.assessmentFooter}>
              <Text style={styles.timeText}>{item.studentIds?.length ?? 0} students in class</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#146C43' },
  content: { padding: 20 },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerStateText: { marginTop: 12, color: '#666' },
  profileCard: { alignItems: 'center', backgroundColor: '#FFF', borderRadius: 15, padding: 30, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  studentName: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 10, marginBottom: 5 },
  studentDetails: { fontSize: 14, color: '#666', marginBottom: 20 },
  statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 20 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#146C43' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#EEE' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  assessmentCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
  assessmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  assessmentTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  assessmentDate: { fontSize: 12, color: '#888' },
  tagsContainer: { flexDirection: 'row', marginBottom: 15, gap: 8 },
  tagLang: { backgroundColor: '#F0F0F0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, color: '#333' },
  tagScoreHigh: { backgroundColor: '#E8F5E9', color: '#2E7D32', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: 'bold' },
  tagScoreMedium: { backgroundColor: '#FFF8E1', color: '#F57F17', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: 'bold' },
  tagScoreLow: { backgroundColor: '#FFEBEE', color: '#D32F2F', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: 'bold' },
  assessmentFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 10 },
  timeText: { marginLeft: 4, fontSize: 12, color: '#666' },
  viewDetailsText: { color: '#146C43', fontSize: 12, fontWeight: '600' }
});
