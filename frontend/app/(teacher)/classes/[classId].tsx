import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ClassDetailsScreen() {
  const { classId } = useLocalSearchParams();
  const router = useRouter();

  const students = [
    { id: '1', name: 'Juan Dela Cruz', score: 85, flag: false },
    { id: '2', name: 'Maria Clara', score: 92, flag: false },
    { id: '3', name: 'Pedro Penduko', score: 45, flag: true }, // Low comprehension flag
    { id: '4', name: 'Andres Bonifacio', score: 78, flag: false },
    { id: '5', name: 'Gabriela Silang', score: 55, flag: true }, // Low comprehension flag
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Class {classId}</Text>
          <Text style={styles.headerSub}>Student Roster & Metrics</Text>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Students</Text>
        
        {students.map((student) => (
          <TouchableOpacity 
            key={student.id} 
            style={styles.studentCard}
            onPress={() => router.push(`/(teacher)/classes/student/${student.id}`)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
            </View>
            
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              
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
