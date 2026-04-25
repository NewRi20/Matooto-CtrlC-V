import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ClassListScreen() {
  const router = useRouter();

  const classes = [
    { id: '3A', name: 'Grade 3-A', subject: 'Science', students: 28 },
    { id: '3B', name: 'Grade 3-B', subject: 'English', students: 25 },
    { id: '4A', name: 'Grade 4-A', subject: 'Science', students: 30 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Classes</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {classes.map((cls) => (
          <TouchableOpacity 
            key={cls.id} 
            style={styles.classCard}
            onPress={() => router.push(`/(teacher)/classes/${cls.id}`)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="school" size={24} color="#146C43" />
              </View>
              <View style={styles.classInfo}>
                <Text style={styles.className}>{cls.name}</Text>
                <Text style={styles.classSubject}>Subject: {cls.subject}</Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Ionicons name="people" size={16} color="#666" />
              <Text style={styles.studentCount}>{cls.students} Students</Text>
              <Ionicons name="chevron-forward" size={20} color="#146C43" style={{ marginLeft: 'auto' }} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: { padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#146C43' },
  content: { padding: 20 },
  classCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#EEE', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  classInfo: { flex: 1 },
  className: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  classSubject: { fontSize: 14, color: '#666' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 15 },
  studentCount: { marginLeft: 8, fontSize: 14, color: '#666', fontWeight: '500' }
});
