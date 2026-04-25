import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { auth } from '@/service/firebaseConfig';
import { getClassById, type ClassData, type StudentProfile } from '@/service/classes.repository';
import { getDoc } from 'firebase/firestore';

const isDocumentRef = (value: unknown): value is { id: string } =>
  value !== null && typeof value === 'object' && 'id' in value && typeof (value as { id?: unknown }).id === 'string';

const isPresent = <T,>(value: T | null): value is T => value !== null;

export default function ClassDetailsScreen() {
  const { classId } = useLocalSearchParams();
  const router = useRouter();
  const classIdValue = useMemo(() => (Array.isArray(classId) ? classId[0] : classId), [classId]);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [students, setStudents] = useState<Array<StudentProfile & { score: number; flag: boolean }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClass = async () => {
      if (!classIdValue) {
        setLoading(false);
        return;
      }

      try {
        const fetchedClass = await getClassById(classIdValue);
        if (!fetchedClass) {
          setClassData(null);
          return;
        }

        setClassData(fetchedClass);

        const studentProfiles = await Promise.all(
          (fetchedClass.studentIds ?? []).map(async (studentRef, index) => {
            if (!isDocumentRef(studentRef)) {
              return null;
            }

            const studentSnap = await getDoc(studentRef as any);
            if (!studentSnap.exists()) {
              return null;
            }

            const data = studentSnap.data() as Record<string, unknown>;

            return {
              id: studentSnap.id,
              fullName: typeof data.fullName === 'string' && data.fullName ? data.fullName : `Student ${index + 1}`,
              email: typeof data.email === 'string' ? data.email : null,
              role: typeof data.role === 'string' ? data.role : '',
              onboarding: Boolean(data.onboarding),
              score: Math.max(40, 95 - index * 8),
              flag: index % 3 === 2,
            };
          })
        );

        setStudents(studentProfiles.filter(isPresent));
      } catch (error) {
        Alert.alert('Unable to load class', 'Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void loadClass();
  }, [classIdValue]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#146C43" />
          <Text style={styles.centerStateText}>Loading class...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!classData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <Text style={styles.centerStateText}>Class not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backFallbackButton}>
            <Text style={styles.backFallbackText}>Go Back</Text>
          </TouchableOpacity>
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
        <View>
          <Text style={styles.headerTitle}>{classData.className}</Text>
          <Text style={styles.headerSub}>Student Roster & Metrics</Text>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Students</Text>
        
        {students.map((student) => (
          <TouchableOpacity 
            key={student.id} 
            style={styles.studentCard}
            onPress={() => router.push(`/(teacher)/classes/student/${student.id}` as any)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{student.fullName.charAt(0)}</Text>
            </View>
            
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.fullName}</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBg}>
                  <View style={[
                    styles.progressBarFill, 
                    { 
                      width: `${student.score}%`, 
                      backgroundColor: student.flag ? '#D32F2F' : '#146C43' 
                    }
                  ]} />
                </View>
                <Text style={styles.scoreText}>{student.score}%</Text>
              </View>
            </View>
            
            {student.flag ? (
              <View style={styles.flagContainer}>
                <Ionicons name="warning" size={24} color="#D32F2F" />
                <Text style={styles.flagText}>Needs Help</Text>
              </View>
            ) : (
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#146C43' },
  headerSub: { fontSize: 14, color: '#666' },
  content: { padding: 20 },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerStateText: { marginTop: 12, color: '#666' },
  backFallbackButton: { marginTop: 14, backgroundColor: '#146C43', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  backFallbackText: { color: '#FFF', fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#666' },
  studentInfo: { flex: 1, marginRight: 10 },
  studentName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  progressContainer: { flexDirection: 'row', alignItems: 'center' },
  progressBarBg: { flex: 1, height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, marginRight: 10 },
  progressBarFill: { height: '100%', borderRadius: 3 },
  scoreText: { fontSize: 12, color: '#666', fontWeight: 'bold', width: 35 },
  flagContainer: { alignItems: 'center' },
  flagText: { fontSize: 10, color: '#D32F2F', fontWeight: 'bold', marginTop: 2 }
});
